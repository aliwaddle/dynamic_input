import React from 'react';
import { IoIosAddCircle } from 'react-icons/io';

import { SidebarProps } from './types';
import { capitalize } from './utils';

const Sidebar: React.FC<SidebarProps> = ({ tables, loading, handleTableClick, handleAddTable }) => {
    return (
        <div className='sidebar'>
            <h2>Tables List</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {tables.map((table, index) => (
                        <li key={index} onClick={() => handleTableClick(table)} style={{ cursor: 'pointer' }}>
                            {capitalize(table.table_name)}
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={handleAddTable}>
                <IoIosAddCircle />
            </button>
        </div>
    );
};

export default Sidebar;
