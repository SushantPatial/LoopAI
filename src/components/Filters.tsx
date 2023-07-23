import React from 'react';
import { Select, Col } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { SelectProps } from 'antd';

type FiltersProps = {
    columns: ColumnType<Object>[],
    selectedOptions: Array<SelectProps['options']>,
    defaultOptions: Array<string[]>,
    selectChange: (title: any, tags: Array<string>) => void
}

const Filters: React.FC<FiltersProps> = ({columns, selectedOptions, defaultOptions, selectChange}) => {
    return (
        <div className="filters">
            <div className="filters-row">
                {
                    columns && columns.map((col: any, index: number) => {
                        return (
                            col.title != "#" && col.title != "number" &&
                            <Col key={index} xs={24} sm={10} lg={5}>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder={col.title}
                                    options={selectedOptions[col.title]}
                                    value={defaultOptions[col.title]}
                                    onChange={(tags: string[]) => selectChange(col.title, tags)}
                                    allowClear={true}
                                    maxTagCount={3}
                                    filterSort={(a: any, b: any) => a.value - b.value}
                                />
                            </Col>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Filters;