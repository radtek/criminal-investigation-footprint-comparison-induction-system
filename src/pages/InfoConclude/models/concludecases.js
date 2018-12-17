import {
  queryCases,
  querySimilarCases,
  queryCaseImg,
  mergeCases
} from '@/services/user';
import { message } from 'antd';
export default {
  namespace: 'concludecases',

  state: {
    cases: [],
    filterCases: []
  },

  effects: {
     // 获取所有管辖案件
     *fetchAllCases(_, { call, put }) {
      const response = yield call(queryCases);
      yield put({
        type: 'getAllCases',
        payload: response,
      });
    },
    // 获取所有管辖案件
    *fetchAllSimilarCases({ payload }, { call, put }) {
      const caseid = payload['caseid'];
      if( caseid ){
        const response = yield call(querySimilarCases, payload);
        yield put({
          type: 'searchCases',
          payload: response,
        });
      }
      else{
        const response = yield call(queryCases);
        yield put({
          type: 'getAllCases',
          payload: response,
        });
      }
    },
    // 获取所有管辖案件
    *mergeCases({ payload }, { call, put }) {
      const { cases } = payload;
      if( cases.length == 2){
        var obj = {
          caseid1: cases[0],
          caseid2: cases[1]
        };
        const response = yield call(mergeCases, obj);
        if(response.status === 0){
          const response2 = yield call(queryCases);
          yield put({
            type: 'getAllCases',
            payload: response2,
          });
        }
        else{
          message.error("案件合并失败");
        }
      }
      else{
        message.warning("请选择两个相似案件合并");
      }
    },

  },

  reducers: {
    getAllCases( state, action ){
      var arr = action.payload.filter(function( item ){
        return item !==  null;
      });
      return {
        ...state,
        cases: arr,
        filterCases: arr,
      }
    },
    searchCases( state, action ) {
      return {
        ...state,
        filterCases: action.payload
      }
    },
    updateCases( state, action ){
      return {
        ...state,
        cases: action.payload,
        filterCases: action.payload,
      };
    }

  },
  subscriptions: {
    //订阅数据源
    
  },
};