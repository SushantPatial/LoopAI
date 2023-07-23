import React from 'react';
import { Table } from 'antd';
import type { ColumnType } from 'antd/es/table';

type TableProps = {
    columns: ColumnType<Object>[],
    filteredData: Array<Object>,
    setPage: (current: number) => void
}


const DataTable: React.FC<TableProps> = ({columns, filteredData, setPage}) => {
    return (
        <div className="table">
            {
                filteredData.length !== 0 &&
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        pageSize: 20,
                        showSizeChanger: false,
                        position: ["bottomCenter"]
                    }}
                    size="small"
                />
            }
        </div>
    )
}

export default DataTable;