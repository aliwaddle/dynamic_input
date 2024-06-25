import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from './Sidebar';
import TableForm from './TableForm';
import TableDetails from './TableDetails';

import { TableData, Column, DataAttribute } from './types';
import { ToastContainer, toast } from 'react-toastify';

const App: React.FC = () => {
    const [tables, setTables] = useState<TableData[]>([]);
    const [tableName, setTableName] = useState('');
    const [columns, setColumns] = useState<Column[]>([{ name: '', type: 'string', attributes: [] }]);
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
    const [newTableName, setNewTableName] = useState('');
    const [renameFormVisible, setRenameFormVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://test.nil.dev/migrate/show_tables');
                setTables(response.data);
            } catch (error) {
                console.error('Error fetching tables:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    const removeColumn = (index: number) => {
        if (columns.length > 1) {
            setColumns(columns.filter((_, colIndex) => colIndex !== index));
        } else {
            toast('There must be at least one column.');
        }
    };

    const handleTableNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTableName(e.target.value);
    };

    const handleNewTableNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTableName(e.target.value);
    };

    const handleColumnChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setColumns(columns.map((column, colIndex) => (colIndex === index ? { ...column, [name]: value } : column)));
    };

    const handleAttributeChange = (index: number, attribute: DataAttribute) => {
        setColumns(
            columns.map((column, colIndex) =>
                colIndex === index
                    ? {
                          ...column,
                          attributes: column.attributes.includes(attribute)
                              ? column.attributes.filter((attr) => attr !== attribute)
                              : [...column.attributes, attribute],
                      }
                    : column
            )
        );
    };

    const toggleDropdown = (index: number) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    const addColumn = () => {
        setColumns([...columns, { name: '', type: 'string', attributes: [] }]);
    };

    const resetForm = () => {
        setTableName('');
        setColumns([{ name: '', type: 'string', attributes: [] }]);
        setFormVisible(false);
    };

    const handleAddTable = () => {
         setTableName('');
        setFormVisible(true);
        setSelectedTable(null);
        setColumns([{ name: '', type: 'string', attributes: [] }]);
    };

    const handleSaveTable = async () => {
        if (!tableName) {
            toast('Table name cannot be empty');
            return;
        }

        for (const column of columns) {
            if (!column.name || !column.type) {
                toast.error('Column name and type cannot be empty');
                return;
            }
        }

        const tableData: TableData = {
            table_name: tableName,
            columns: columns.filter((column) => column.name && column.type),
        };

        try {
            const response = await axios.post('https://test.nil.dev/add_table', tableData);
            console.log('Response:', response.data);
            setTables((prevTables) => [...prevTables, tableData]);
            resetForm();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error adding table:', error.response?.data);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    const handleDeleteTable = async (tableName: string) => {
        try {
            const response = await axios.post('https://test.nil.dev/migrate/delete_table', { table_name: tableName });
            console.log('Response:', response.data);

            setTables(tables.filter((table) => table.table_name !== tableName));
            setSelectedTable(null);
            toast.success('Table deleted successfully');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error deleting table:', error.response?.data);
                toast.error('Error deleting table');
            } else {
                console.error('Unexpected error:', error);
                toast.error('Unexpected error deleting table');
            }
        }
    };

    const handleRenameTable = async () => {
        if (selectedTable) {
            if (!newTableName) {
                toast.error('New table name cannot be empty');
                return;
            }

            const tableNameExists = tables.some((table) => table.table_name === newTableName);
            if (tableNameExists) {
                toast.error('Table name already exists. Please choose a different name.');
                return;
            }

            try {
                const response = await axios.post('https://test.nil.dev/migrate/rename_table', {
                    old_name: selectedTable.table_name,
                    new_name: newTableName,
                });
                console.log('Response:', response.data);
                setTables(tables.map((table) => (table.table_name === selectedTable.table_name ? { ...table, table_name: newTableName } : table)));
                setSelectedTable({ ...selectedTable, table_name: newTableName });
                setNewTableName('');
                setRenameFormVisible(false);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error renaming table:', error.response?.data);
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        }
    };

    const handleCancelRename = () => {
        setRenameFormVisible(false);
        setNewTableName('');
    };

    const handleTableClick = (table: TableData) => {
        setSelectedTable(table);
        setTableName(table.table_name);
        setColumns(table.columns);
        setFormVisible(false);
        setRenameFormVisible(false);
    };

    const handleShowRenameForm = () => {
        if (selectedTable) {
            setNewTableName(selectedTable.table_name);
            setRenameFormVisible(true);
        }
    };

    const handleDeleteColumn = async (tableName: string, columnName: string) => {
        try {
            const response = await axios.post('https://test.nil.dev/migrate/edit_table', {
                table_name: tableName,
                add_columns: [],
                edit_columns: [],
                delete_columns: [columnName],
            });
            console.log('Response:', response.data);

            setTables((prevTables) =>
                prevTables.map((table) => {
                    if (table.table_name === tableName) {
                        return {
                            ...table,
                            columns: table.columns.filter((col) => col.name !== columnName),
                        };
                    }
                    return table;
                })
            );
            if (selectedTable) {
                setSelectedTable({
                    ...selectedTable,
                    columns: selectedTable.columns.filter((col) => col.name !== columnName),
                });
            }
            toast.success('Column deleted successfully');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error deleting column:', error.response?.data);
                toast.error('Error deleting column');
            } else {
                console.error('Unexpected error:', error);
                toast.error('Unexpected error deleting column');
            }
        }
    };
    const handleAddColumn = async (tableName: string, newColumn: Column) => {
        try {
            const formattedColumn = {
                ...newColumn,
                attributes: newColumn.attributes.join(', '),
            };

            const response = await axios.post('https://test.nil.dev/migrate/edit_table', {
                table_name: tableName,
                add_columns: [formattedColumn],
                edit_columns: [],
                delete_columns: [],
            });
            console.log('Response:', response.data);

            setTables((prevTables) =>
                prevTables.map((table) => {
                    if (table.table_name === tableName) {
                        return {
                            ...table,
                            columns: [...table.columns, newColumn],
                        };
                    }
                    return table;
                })
            );

            if (selectedTable && selectedTable.table_name === tableName) {
                setSelectedTable({
                    ...selectedTable,
                    columns: [...selectedTable.columns, newColumn],
                });
            }

            toast.success('Column added successfully');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error adding column:', error.response?.data);
                toast.error('Error adding column');
            } else {
                console.error('Unexpected error:', error);
                toast.error('Unexpected error adding column');
            }
        }
    };


    return (
        <div className='table-container'>
            <ToastContainer autoClose={1000} />
            <Sidebar tables={tables} loading={loading} handleTableClick={handleTableClick} handleAddTable={handleAddTable} />
            <div className='main-content'>
                {formVisible ? (
                    <TableForm
                        tableName={tableName}
                        columns={columns}
                        dropdownOpen={dropdownOpen}
                        handleTableNameChange={handleTableNameChange}
                        handleColumnChange={handleColumnChange}
                        handleAttributeChange={handleAttributeChange}
                        toggleDropdown={toggleDropdown}
                        addColumn={addColumn}
                        handleSaveTable={handleSaveTable}
                        removeColumn={removeColumn}
                    />
                ) : selectedTable ? (
                    <TableDetails
                        selectedTable={selectedTable}
                        columns={columns}
                        setColumns={setColumns}
                        renameFormVisible={renameFormVisible}
                        newTableName={newTableName}
                        handleNewTableNameChange={handleNewTableNameChange}
                        handleRenameTable={handleRenameTable}
                        handleCancelRename={handleCancelRename}
                        handleShowRenameForm={handleShowRenameForm}
                        handleDeleteTable={handleDeleteTable}
                        handleDeleteColumn={handleDeleteColumn}
                        handleAddColumn={handleAddColumn}
                    />
                ) : (
                    <p>Select a table to view details</p>
                )}
            </div>
        </div>
    );
};

export default App;
