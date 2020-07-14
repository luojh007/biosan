import * as React from "react";
import * as ReactDOM from "react-dom";
import './App.css';
import { SearchBarValue, SearchBarItem } from "./components/Searchbar/interface";
import { SearchBar } from './components'
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
    render() {
        return (
            <SearchBar
                value={value}
                dataScore={dataScore}
                expand={this.state.expand}
                onSearch={this.onSearch}
                onExpand={this.onExpand}
            />
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);