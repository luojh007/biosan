import * as React from 'react'
import { Input, Button, Divider, Form, Popover, Table, Dropdown, Menu, message, Popconfirm, } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import { InputTemplateProps, InputTemplateState, tableItem } from "./interface";
import { FormInstance } from 'antd/lib/form';
const TextArea = Input.TextArea
const styles = require('./style.less')
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'input' | 'textArea';
  record: tableItem;
  index: number;
  children: React.ReactNode;
}
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'input' ? <Input autoFocus={true} /> : <TextArea autoFocus={true} />
  return <td {...restProps}>
    {editing ? (
      <Form.Item
        name={dataIndex}
        style={{ margin: 0 }}
        rules={[
          {
            required: true,
            message: `请输入 ${title}!`,
          },
        ]}
      >
        {inputNode}
      </Form.Item>
    ) : (
        children
      )}
  </td>
}
class InputTemplate extends React.Component<InputTemplateProps, InputTemplateState> {
  formRef = React.createRef<FormInstance>();
  constructor(props: InputTemplateProps) {
    super(props);
    // 增加一些特有属性到table-cell中
    let tableData = props.tableList.map((item, index) => {
      item.inputType = props.type;
      item.editing = false
      item.key = `${index}`
      return item
    })
    this.state = {
      editingKey: '',
      editInput: '',
      tableData,
      optVisible: false,
      moreOptKey: ''
    }
  }
  handleVisibleChange = flag => {
    this.setState({ optVisible: flag });
  };
  editOpt = (record) => {
    return this.state.editingKey !== '' ?
      <div style={{ color: '#6666' }}>
        <span>选择</span>
        <Divider type={'vertical'} />
        <span>更多<DownOutlined /></span>
      </div> :
      <div id='optArea'>
        <a onClick={() => this.choise(record)}>选择</a>
        <Divider type={'vertical'} />
        <Dropdown
          overlay={() => (
            <Menu>
              <Menu.Item key={'0'}>
                <a style={{ color: '#1890ff' }} onClick={() => this.edit(record)}>编辑</a>
              </Menu.Item>
              <Menu.Item key={'1'}>
                <Popconfirm
                  title="是否删除?"
                  onConfirm={() => this.delete(record)}
                  okText="是"
                  cancelText="否"
                  placement={'right'}
                >
                  <a style={{ color: '#1890ff' }}>删除</a>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          )}
          getPopupContainer={() => document.getElementById('optArea')}
          visible={record.key === this.state.moreOptKey && this.state.optVisible}
          trigger={["click"]}
          onVisibleChange={this.handleVisibleChange}
          placement="bottomCenter"
        >
          <a onClick={() => this.moreEdit(record.key)}>更多<DownOutlined /></a>
        </Dropdown>
      </div>
  }
  colnums = [
    {
      key: 'number',
      dataIndex: 'number',
      title: '序号',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: '常用临床诊断模板',
      editable: true,
    },
    {
      key: 'opt',
      dataIndex: 'opt',
      title: '操作',
      render: (text, record, index) => {
        const editable = this.isEditing(record);
        return editable ? <div>
          <a onClick={() => this.save(record.key)}>保存</a>
          <Divider type={'vertical'} />
          <a onClick={() => this.cancel(record.isAdd)}>取消</a>
        </div> : this.editOpt(record)
      }
    }
  ]
  mergedColumns = this.colnums.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: tableItem) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: this.isEditing(record),
      }),
    };
  });
  isEditing = (record: tableItem) => record.key === this.state.editingKey;
  edit = (record) => {
    this.formRef.current.setFieldsValue({ description: '', ...record });
    this.setState({ editingKey: record.key, optVisible: false })
  }
  cancel = (isAdd: boolean) => {
    if (isAdd) {
      let data = this.state.tableData;
      data.pop();
      this.setState({ tableData: [...data] })
    }
    this.formRef.current.setFieldsValue({ description: '' })
    this.setState({ editingKey: '' })
  };
  save = (key) => {
    this.formRef.current.validateFields().then((values) => {
      this.props.saveItem(values)
    })
  }
  delete = (item) => {
    console.log(item)
  }
  choise = (record) => {
    console.log(record)
  }
  moreEdit = (key) => {
    this.setState({ moreOptKey: key });
  }
  addItem = () => {
    this.formRef.current.validateFields().then(_ => {
      let data = this.state.tableData;
      let newKey = `${data.length + 1}`
      const newItem = {
        key: newKey,  // 数组长度递增
        description: '',
        editing: true,
        isAdd: true,
      };
      this.setState({
        tableData: [...data, newItem],
        editingKey: `${newKey}`
      })
      this.formRef.current
    })
  }
  popverVisibleChange = (flag) => {
    if (flag === false) {

    }
  }
  render() {
    const { tableData, editingKey } = this.state
    const tableContent = (
      <Form ref={this.formRef} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          rowClassName="editable-row"
          dataSource={tableData}
          columns={this.mergedColumns}
          pagination={false}
        />
      </Form>
    )
    return (
      <div className={styles.main + ' ' + 'ant-input'}>
        {this.props.type === 'input' ? <input className={styles.input} /> : <textarea className={styles.textArea} rows={4} maxLength={500} />}
        <Popover
          arrowPointAtCenter
          onVisibleChange={this.popverVisibleChange}
          trigger='click'
          title={<Button disabled={editingKey !== ''} type={'primary'} onClick={this.addItem}>{this.props.addButtonStr || '新增模版'}</Button>}
          content={tableContent}
        >
          <a className={this.props.type === 'input' ? styles.inputA : styles.textareaA}>常用模版</a>
        </Popover >
      </div>
    )
  }
}
export default InputTemplate