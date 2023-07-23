import React, { useState, useRef } from "react";
import Papa from "papaparse";
import type { ColumnType } from 'antd/es/table';
import type { SelectProps } from 'antd';
import Filters from "./Filters";
import DataTable from "./DataTable";

function Upload() {
    // ===== Misc =====
    const [fileName, setFileName] = useState<string>(""); // File Name
    const [page, setPage] = useState<number>(1); // Pagination Number

    // ===== Table Data =====
    const [columns, setColumns] = useState<ColumnType<Object>[]>([]); // Headings
    const [tableData, setTableData] = useState<Array<Object>>([]); // Original Data
    const [filteredData, setFilteredData] = useState<Array<Object>>([]); // Filtered Data

    // ===== Dropdown Filters =====
    const [allOptions, setAllOptions] = useState<Array<SelectProps['options']>>([]); // All Dropdowns
    const [selectedOptions, setSelectedOptions] = useState<Array<SelectProps['options']>>([]); // Selected Dropdowns
    const [defaultOptions, setDefaultOptions] = useState<Array<string[]>>([]); // Default Selected Dropdowns


    // ===== Functions =====

    // 1. Function to upload CSV and process it using Papaparse
    const uploadCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) 
            return;

        let file = event.target.files[0];
        setFileName(file.name);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (res: any) => {

                let keys = Object.keys(res.data[0]);
                let tempColumns: ColumnType<Object>[] = [];

                // For serial number
                tempColumns.push({
                    title: '#',
                    dataIndex: 'index',
                    key: 'index',
                    width: "80px",
                    render: (text: string, record: any, index: number) => {
                        return page === 1 ? (index + 1) : ((page - 1) * 20) + (index + 1)
                    },
                })

                // Setting up columns
                keys.map((key: string) => {
                    tempColumns.push({
                        title: key,
                        dataIndex: key,
                        key: key
                    })
                });

                // Setting all dropdown options
                let options: any = [];
                let all: any = [];

                res.data.map((row: any) => {
                    keys.map((key: string) => {
                        if (key === "number")
                            return;

                        if (!all[key]) {
                            all[key] = new Set();
                            options[key] = [];
                        }

                        all[key].add(row[key]);
                    })
                })

                keys.map((key: string) => {
                    if (all[key]) {
                        let arr = Array.from(all[key]).sort();

                        arr.map((option: any) => {
                            options[key].push({
                                label: option,
                                value: option
                            })
                        })
                    }
                })

                // Setting states
                setAllOptions(options);
                setSelectedOptions(options);
                setDefaultOptions([]);
                setColumns(tempColumns);
                setFilteredData(res.data);
                setTableData(res.data);
            },
        });
    };

    // 2. Function to process data when dropdown changes
    const selectChange = (title: any, tags: Array<string>) => {

        if (tags.length === 0) {
            setFilteredData(tableData);
            setSelectedOptions(allOptions);
            setDefaultOptions([]);

        } else {

            // Filtering Table with selected options
            let newData = tableData.filter((row: any) => {
                return tags.includes(row[title]);
            });

            let options: Array<any> = [];
            let optionsSet: Array<Set<string>> = [];
            let defaultSelected: Array<string[]> = [];

            options[title] = allOptions[title];
            defaultSelected[title] = tags;

            // Getting unique options from newData
            newData.map((row: any) => {
                columns.map((key: any) => {
                    let keyTitle = key.title;
                    let keyValue = row[keyTitle];

                    if (keyTitle === "number" || keyTitle === "#" || keyTitle === title)
                        return;

                    if (!optionsSet[keyTitle]) {
                        optionsSet[keyTitle] = new Set();
                        options[keyTitle] = [];
                        defaultSelected[keyTitle] = [];
                    }

                    if (!optionsSet[keyTitle].has(keyValue)) {
                        optionsSet[keyTitle].add(keyValue);

                        options[keyTitle].push({
                            label: keyValue,
                            value: keyValue
                        });

                        defaultSelected[keyTitle].push(keyValue);
                    }
                })
            })

            // Sorting default options
            columns.map((key: any) => {
                let keyTitle = key.title;

                if (defaultSelected[keyTitle]) {
                    defaultSelected[keyTitle].sort((a: string, b: string) => parseInt(a) - parseInt(b));
                }
            })

            // Setting states
            setSelectedOptions(options);
            setDefaultOptions(defaultSelected);
            setFilteredData(newData);
        }
    }


    return (
        <div>
            {/* File Uploader */}
            <div className="file-input">
                <label htmlFor="file" className="label">
                    {fileName ? fileName : "Choose A CSV File"}
                </label>
                <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={uploadCSV}
                    accept=".csv"
                />
            </div>

            <hr />

            {/* Filters */}
            <Filters columns={columns} selectedOptions={selectedOptions} defaultOptions={defaultOptions} selectChange={selectChange} />

            {/* Table */}
            <DataTable columns={columns} filteredData={filteredData} setPage={setPage} />
        </div>
    );
}

export default Upload;