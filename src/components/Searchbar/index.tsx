import * as React from 'react';
import { Row, Input, Button, Select, Form, DatePicker, Cascader } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { DownOutlined, UpOutlined, SearchOutlined } from '@ant-design/icons';
import { SearchBarProps, SearchBarItemOption } from './interface'
const styles = require('./searchBar.less')
import moment = require('moment');
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const defaultFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const formItemsObj = {
  // 待扩展
  input: (value: any) => {
    const { className, onKeyDown } = value;
    return (
      <Input
        placeholder="请输入"
        autoComplete="off"
        className={`${styles.width100} ${className}`}
        onKeyDown={onKeyDown}
      />
    );
  },
  select: (value: any) => {
    const { options = [], className, onChange, disabled, allowClear, showSearch, filterOption } = value;
    return (
      <Select
        placeholder="请选择"
        className={`${styles.width100} ${className}`}
        onChange={onChange}
        disabled={disabled}
        allowClear={allowClear}
        showSearch={showSearch}
        filterOption={filterOption}
      >
        {options.map((item: SearchBarItemOption) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    );
  },
  rangePicker: (value: any) => {
    const { className } = value;
    return (
      <RangePicker
        className={`${styles.width100} ${className}`}
        placeholder={['请选择', '请选择']}
      />
    );
  },
  datePicker: (value: any) => {
    const { className } = value;
    return <DatePicker
      className={`${styles.width100} ${className}`}
      placeholder={'请选择日期'}
    />;
  },
  cascader: (value: any) => {
    const { className, loadData, changeOnSelect, onChange, options = [] } = value;
    return <Cascader
      className={`${styles.width100} ${className}`}
      onChange={onChange}
      placeholder={'请选择'}
      loadData={loadData}
      changeOnSelect={changeOnSelect}
      options={options}
    />;
  }
};

export default class SearchBar extends React.Component<SearchBarProps, any>{
  formRef = React.createRef<FormInstance>();
  onSearch = () => {
    this.formRef.current.validateFields().then((values: any[]) => {
      let res = {};
      for (let i in values) {
        if (i.split('_')[0] === 'rangePicker') {
          for (let it of this.props.dataScore) {
            if (it.key === i) {
              res[it.keys[0]] = (values[i] && values[i].length > 0) ? moment(values[i][0]).format(dateFormat) : undefined;
              res[it.keys[1]] = (values[i] && values[i].length > 0) ? moment(values[i][1]).format(dateFormat) : undefined;
              break;
            }
          }
          continue;
        } else if (i.split('_')[0] === 'datePicker') {
          res[i.split('_')[1]] = values[i] ? moment(values[i]).format(dateFormat) : undefined;
          continue;
        }
        res[i] = values[i];
      }
      this.props.onSearch(res);
    })

  };
  onChange = (v: string, o: object, callback: Function) => {
    // 特殊业务下需要的，后去优化
    if (v && o && callback) {
      callback(v, o);
    } else if (v && callback) {
      callback(v);
    }
  }
  handleReset = () => {
    const { onReset, dataScore } = this.props;
    let defaultValue = {};
    for (let i in dataScore) {
      if (!dataScore[i].disabled) {
        // 禁用的不可置空
        defaultValue[dataScore[i].key] = dataScore[i].defaultValue;
      }
    }
    this.formRef.current.setFieldsValue(defaultValue);
    onReset && onReset();
  };
  getRangePickerInitValue = (keys: string[]) => {
    const { value } = this.props;
    if (value[keys[0]] && value[keys[1]]) {
      return [moment(value[keys[0]], dateFormat), moment(value[keys[1]], dateFormat)];
    }
  }
  createFormItemList = () => {
    // 生成检索项
    const { dataScore, expand, value } = this.props;
    return dataScore.map((formItem, index) => {
      const { label, key, keys, type, onChangeCallback } = formItem;
      return (
        <div
          style={{ display: index > 2 && !expand ? 'none' : 'inline-block' }}
          className={styles.searchItem}
          key={key}
        >
          <FormItem
            name={key}
            label={label}
            initialValue={type === 'rangePicker' ? this.getRangePickerInitValue(keys) : value[key]}
          >
            {formItemsObj[type]({
              ...formItem,
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' && type === 'input') {
                  this.onSearch();
                }
              },
              onChange: (v: any, o: any) => this.onChange(v, o, onChangeCallback)
            })}
          </FormItem>
        </div>
      );
    });
  };
  render() {
    const { expand, onExpand, dataScore, canSearch } = this.props;
    const search = canSearch === false ? false : true;
    return (
      <div className={styles.searchFormContainer} >
        <Form ref={this.formRef} {...defaultFormItemLayout} >
          <Row>{this.createFormItemList()}</Row>
        </Form>
        <div className={styles.optLine}>
          <Button className={styles.resetBtn} onClick={this.handleReset}>
            重置
        </Button>
          {search !== false && (
            <Button
              className={`searchBtnStyle ${styles.searchBtn}`}
              icon={<SearchOutlined />}
              onClick={this.onSearch}
              type={'primary'}
            >
              查询
            </Button>
          )}
          <span
            style={dataScore.length > 3 ? {} : { display: 'none' }}
            onClick={onExpand}
            className={styles.unflod}
          >
            <span className="button_font">
              {expand === true ? '收起' : '展开'}
            </span>
            {expand === true ? <UpOutlined /> : <DownOutlined />}
          </span>
        </div>
      </div>
    )
  }
}
