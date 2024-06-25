import { IoIosAddCircle } from 'react-icons/io';
import { FaSave, FaTrash } from 'react-icons/fa';

import { TableFormProps, DataAttributeValues } from './types';

const TableForm: React.FC<TableFormProps> = ({
    tableName,
    columns,
    dropdownOpen,
    handleTableNameChange,
    handleColumnChange,
    handleAttributeChange,
    toggleDropdown,
    addColumn,
    removeColumn,
    handleSaveTable,
}) => (
    <>
        <h2>Create Table</h2>
        <div className='form-group'>
            <div>
                <label>Table Name</label>
                <input type='text' name='tableName' value={tableName} onChange={handleTableNameChange} />
            </div>
        </div>
        {columns.map((column, index) => (
            <div className='form-group' key={index}>
                <div>
                    <label>Column Name</label>
                    <input type='text' name='name' value={column.name} onChange={(e) => handleColumnChange(index, e)} />
                </div>
                <div>
                    <label>Column Type</label>
                    <select name='type' value={column.type} onChange={(e) => handleColumnChange(index, e)}>
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
                        <div className='select-attributes' onClick={() => toggleDropdown(index)}>
                            {column.attributes.length > 0 ? column.attributes : 'Select Attributes'}
                        </div>
                        {dropdownOpen === index && (
                            <div className='dropdownOpen'>
                                {DataAttributeValues.map((attr) => (
                                    <label key={attr}>
                                        <input
                                            type='checkbox'
                                            checked={column.attributes.join(', ').includes(attr)}
                                            onChange={() => handleAttributeChange(index, attr)}
                                        />
                                        {attr}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className='add-delete-btn-container'>
                    <button className='add-column' onClick={addColumn}>
                        <IoIosAddCircle />
                    </button>
                    <button className='delete-table' onClick={() => removeColumn(index)}>
                        <FaTrash />
                    </button>
                </div>
            </div>
        ))}
        <button onClick={handleSaveTable}>
            <FaSave />
        </button>
    </>
);

export default TableForm;
