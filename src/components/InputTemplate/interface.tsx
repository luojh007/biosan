export interface tableItem {
  description: string;
  [other: string]: any,
}
export interface tableHead {
  number: string;
  description: string;
  opt: string;
}
export interface optItem {
  name: string,
  onClick: (value: tableItem) => void
}
export interface InputTemplateProps {
  tableList: tableItem[];
  type?: string;  //input | textArea
  addButtonStr?: string;
  saveItem: (value: any) => void;
  deleteItem: (id: number) => void;
  reloadData: () => void;
  choiseItem: (value: tableItem) => void
}
export interface InputTemplateState {
  editingKey: string,
  editInput: string,
  tableData: tableItem[],
  optVisible: boolean,
  moreOptKey: string
}