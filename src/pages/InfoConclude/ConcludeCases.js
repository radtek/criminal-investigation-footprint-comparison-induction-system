import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Breadcrumb, Alert, Input, Icon, Table, Button, Modal, Checkbox } from 'antd';
import styles from './ConcludeCases.less';

const { Search } = Input;

@connect(({ concludecases, loading }) => ({
  filterCases: concludecases.filterCases,
  loading: loading.effects['concludecases/fetchAllCases'],
}))
class ConcludeCases extends React.Component {
  state = {
    checkedVals: []
  };
  handleChange = ( caseid, boolVal) => {
    if(boolVal){
      var arr = this.state.checkedVals.slice();
      arr.push( caseid );
      this.setState({
        checkedVals: arr
      });
    }
    else{
      var arr = this.state.checkedVals.slice();
      var index = arr.indexOf( caseid );
      if( index !== -1){
        arr.splice(index,1);
      }
      this.setState({
        checkedVals: arr
      });
    }
  }
  // 表头数据
  columns = [
    {
      title: '操作',
      key: 'action',
      width: 50,
      render: (text, record) => (
        <span>
          <Checkbox onChange={(e) => this.handleChange(record.caseid, e.target.checked)}></Checkbox>
        </span>
      ),
    },
    {
      title: '案件编号',
      dataIndex: 'caseid',
      width: 200,
    },
    {
      title: '案件详情',
      dataIndex: 'detail',
      width: 200,
    },
    {
      title: '地点',
      dataIndex: 'location',
      width: 200,
    },
    {
      title: '足迹采集方式',
      dataIndex: 'gatherMethod',
      width: 200,
    },
    {
      title: '足迹遗留方式',
      dataIndex: 'leaveMethod',
      width: 200,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取用户数据
    dispatch({ type: 'concludecases/fetchAllCases' });
  }
  handleMerge = () => {
    //console.log(this.state.checkedVals);
    //将获取到的caseid合并到一起
    const { dispatch } = this.props;
    const { checkedVals } = this.state;
    dispatch({
      type: 'concludecases/mergeCases',
      payload: {
        cases: checkedVals
      }
    });
  }

  handleSearch = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'concludecases/fetchAllSimilarCases',
      payload: {
        caseid: value,
      },
    });
  };

  render() {
    const { filterCases, loading } = this.props;
    return (
      <div>
        <div className={styles.content}>
          <div className={styles.headerNav}>
            <Breadcrumb>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              <Breadcrumb.Item>足迹归纳对比</Breadcrumb.Item>
              <Breadcrumb.Item>所有管辖案件</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className={styles.headerH}>
            <h2>选择相似案件合并</h2>
          </div>
        </div>
        <div className={styles.contentBody} id="allCases">
          <div className={styles.searchInput}>
            <Search placeholder="根据案件编号查询所有相似案件" enterButton="点击查询" onSearch={this.handleSearch} />
          </div>
          <div>
              <Button type="primary" onClick={this.handleMerge} className={styles.floatBtn}>点击合并</Button>
          </div>
          <Table
            columns={this.columns}
            bordered
            dataSource={filterCases}
            rowKey={record => (record.caseid + record.detail)}
            loading={loading}
          />
        </div> 
      </div>
    );
  }
}
export default ConcludeCases;
