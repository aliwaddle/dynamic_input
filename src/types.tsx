import { ChangeEvent } from "react";

export type DataAttribute =
    | 'primary_key=True'
    | 'nullable=True'
    | 'unique=True'
    | 'index=True'
    | 'autoincrement=True'
    | 'foreign_key=True'


export const DataAttributeValues: DataAttribute[] = [
    'primary_key=True',
    'nullable=True',
    'unique=True',
    'index=True',
    'autoincrement=True',
    'foreign_key=True',

];

export type DataType = 'string' | 'integer' | 'boolean' | 'float' | 'datetime' | 'text';

export interface Column {
    name: string;
    type: DataType;
    attributes: DataAttribute[];
}

export interface TableData {
    table_name: string;
    columns: Column[];
}

export interface SidebarProps {
    tables: TableData[];
    loading: boolean;
    handleTableClick: (table: TableData) => void;
    handleAddTable: () => void;
}

export interface TableFormProps {
    tableName: string;
    columns: Column[];
    dropdownOpen: number | null;
    handleTableNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleColumnChange: (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleAttributeChange: (index: number, attribute: DataAttribute) => void;
    toggleDropdown: (index: number) => void;
    addColumn: () => void;
    handleSaveTable: () => void;
    removeColumn: (index: number) => void;
}

export interface TableDetailsProps {
    selectedTable: TableData;
    columns: Column[];
    setColumns: (columns: Column[]) => void;
    renameFormVisible: boolean;
    newTableName: string;
    handleNewTableNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleRenameTable: () => void;
    handleCancelRename: () => void;
    handleDeleteTable: (tableName: string) => void;
    handleShowRenameForm: () => void;
    handleDeleteColumn: (tableName: string, columnName: string) => void;
    handleAddColumn: (tableName: string, newColumn: Column) => void;
}

