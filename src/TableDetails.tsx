import { ChangeEvent, useState } from 'react';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { IoIosAddCircle } from 'react-icons/io';

import { TableDetailsProps, Column, DataAttributeValues,DataAttribute } from './types';
import { capitalize } from './utils';

const TableDetails: React.FC<TableDetailsProps> = ({
    selectedTable,
    columns,
    renameFormVisible,
    newTableName,
    handleNewTableNameChange,
    handleRenameTable,
    handleCancelRename,
    handleShowRenameForm,
    handleDeleteColumn,
    handleDeleteTable,
    handleAddColumn,
}) => {
    const [newColumn, setNewColumn] = useState<Column>({ name: '', type: 'string', attributes: [] });
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const handleNewColumnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewColumn({ ...newColumn, [name]: value });
    };

const handleNewAttributeChange = (attribute: DataAttribute) => {
    setNewColumn((prevColumn) => ({
        ...prevColumn,
        attributes: prevColumn.attributes.includes(attribute)
            ? prevColumn.attributes.filter((attr) => attr !== attribute)
            : [...prevColumn.attributes, attribute],
    }));
};


    return (
        <div className='table-details'>
            <h2>Table Details</h2>
            <h3>{capitalize(selectedTable?.table_name || '')}</h3>
            <div className='rename-form'>
                {renameFormVisible ? (
                    <>
                        <input type='text' className='table-name-change' value={capitalize(newTableName)} onChange={handleNewTableNameChange} />
                        <button onClick={handleRenameTable}>
                            <FaSave />
                        </button>
                        <button className='delete-table' onClick={handleCancelRename}>
                            <MdCancel />
                        </button>
                    </>
                ) : (
                    <button onClick={handleShowRenameForm}>
                        <FaEdit />
                    </button>
                )}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Column Name</th>
                        <th>Type</th>
                        <th>Attributes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className='table-body'>
                    {columns.map((column, index) => (
                        <tr key={index}>
                            <td>{capitalize(column.name)}</td>
                            <td>{column.type}</td>
                            <td>{column.attributes}</td>
                            <td>
                                <button className='delete-table' onClick={() => handleDeleteColumn(selectedTable.table_name, column.name)}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='add-column-form'>
                <h3>Add New Column</h3>
                <div className='form-group'>
                    <div>
                        <label>Column Name</label>
                        <input type='text' name='name' value={newColumn.name} onChange={handleNewColumnChange} />
                    </div>
                    <div>
                        <label>Column Type</label>
                        <select name='type' value={newColumn.type} onChange={handleNewColumnChange}>
                            <option value='string'>String</option>
                            <option value='integer'>Integer</option>
                            <option value='boolean'>Boolean</option>
                            <option value='float'>Float</option>
                            <option value='datetime'>DateTime</option>
                            <option value='text'>Text</option>
                        </select>
                    </div>
                    <div className='attributes-container'>
                        <label>Attributes</label>
                        <div>
                            <div className='select-attributes' onClick={() => setDropdownOpen(!dropdownOpen)}>
                                {newColumn.attributes.length > 0 ? newColumn.attributes.join(', ') : 'Select Attributes'}
                            </div>
                            {dropdownOpen && (
                                <div className='dropdownOpen'>
                                    {DataAttributeValues.map((attr) => (
                                        <label key={attr}>
                                            <input
                                                type='checkbox'
                                                checked={newColumn.attributes.includes(attr)}
                                                onChange={() => handleNewAttributeChange(attr)}
                                            />
                                            {attr}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button className='add-column' onClick={() => handleAddColumn(selectedTable.table_name, newColumn)}>
                        <IoIosAddCircle />
                    </button>
                </div>
            </div>
            <button className='delete-table' onClick={() => handleDeleteTable(selectedTable.table_name)}>
                <FaTrash />
            </button>
        </div>
    );
};

export default TableDetails;
