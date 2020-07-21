import * as React from "react";
import * as ReactDOM from "react-dom";
import './App.css';
import { SearchBarValue, SearchBarItem } from "./components/Searchbar/interface";
import { tableHead, tableItem } from "./components/InputTemplate/interface";
import { SearchBar, InputTemplate } from './components'
const dataScore: SearchBarItem[] = [
    {
        type: 'input',
        label: '姓名',
        key: 'name'
    },
    {
        type: 'select',
        label: '性别',
        key: 'sex',
        options: [
            { label: '男', value: '1' },
            { label: '女', value: '2' }
        ]
    },
    {
        type: 'rangePicker',
        label: '工作时间',
        key: 'rangePicker_jobStart_jobEnd',
        keys: ['jobStart', 'jobEnd'],
    },
    {
        type: 'datePicker',
        label: '出生日期',
        key: 'datePicker_birthday',
    },
    {
        type: 'cascader',
        label: '出生地址',
        key: 'address',
        options: [
            {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                    {
                        value: 'hangzhou',
                        label: 'Hangzhou',
                        children: [
                            {
                                value: 'xihu',
                                label: 'West Lake',
                            },
                        ],
                    },
                ],
            },
            {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [
                    {
                        value: 'nanjing',
                        label: 'Nanjing',
                        children: [
                            {
                                value: 'zhonghuamen',
                                label: 'Zhong Hua Men',
                            },
                        ],
                    },
                ],
            },
        ]
    },
]
const value: SearchBarValue = {
    name: undefined,
    sex: undefined,
    jobStart: undefined,
    jobEnd: undefined,
    birthday: undefined,
    address: undefined,
}
const inputTabledataScore: tableItem[] = [{
    id: 1,
    description: '描述11111',
}, {
    id: 2,
    description: '描述11222',
}]
const inputTableHead: tableHead = { number: '序号', description: '常用临床诊断模板', opt: '操作' }
class App extends React.Component<any, any>{
    constructor(props: any) {
        super(props)
        this.state = {
            expand: false
        }
    }
    onSearch = (value: SearchBarValue): void => {
        console.log(value)
    }
    onExpand = () => {
        this.setState({ expand: !this.state.expand })
    }
    choiseClick = (value) => {
        console.log(value)
    }
    saveItem = (value) => {
        console.log(value)
    }
    deleteItem = (id) => {
        console.log(id)
    }
    // 重新加载
    reloadData = () => {

    }
    render() {
        return (
            // <SearchBar
            //     value={value}
            //     dataScore={dataScore}
            //     expand={this.state.expand}
            //     onSearch={this.onSearch}
            //     onExpand={this.onExpand}
            // />
            <InputTemplate
                tableList={inputTabledataScore}
                saveItem={this.saveItem}
                deleteItem={this.deleteItem}
                reloadData={this.reloadData}
                choiseItem={this.choiseClick}
            />
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);