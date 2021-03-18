import { MILID } from "@/models";

import { Vue } from 'vue-property-decorator';

import { $module } from './module-service';
import { $config } from "./config-service";
import { $user } from "./user-service";


import axios from 'axios';

const defaultAxios = {
  headers: { 
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer abcd'
  }
};

export interface MILIDEvent {
  module: string;
  lesson: string;
  state: MILID.LessonState;
  uid?: string;
  username?: string;
  timestamp?: number;
}


class MetricService {
  public STORAGE_KEY = "milid-progression";

  public progressionState: any = {};

  constructor() {
    this.progressionState = Vue.observable({});
  }

  async get() {
    const state = (await $config.storageGet(this.STORAGE_KEY)) as any;
    const keys = Object.keys(state ||{});
    //
    // looking on Airtable
    if(!keys.length){
      await this.sync();
      await $config.storageSet(this.STORAGE_KEY,this.progressionState);
    }    

    return this.progressionState;
  }

  //
  // push usage 
  async event(params: MILIDEvent){
    const user = await $user.get();

    //
    // extends params
    const fields = Object.assign({},params,{
      uid:user.id, 
      username:user.name,
      timestamp: (params.timestamp || new Date())
    });


    console.log('---DBG event',fields);

    //
    // check state before to continue 
    const current = this.progressionState[params.lesson];
    if(current &&
      (current.state == params.state || current.state == MILID.LessonState.DONE)) {
     return fields;
    } 
    // event already
    if(current && current.module == params.module){
      return fields;
    }

    //
    // save localStorage
    await this.set(fields);


    //
    // save php
    try{
      await axios.post("/event", fields, defaultAxios);
    }catch(e){
      console.error("unable to update event", e);
    }
    return fields;
  }

  //
  // keep track of all lessons
  async set(params: MILIDEvent){
    this.progressionState[params.lesson] = {
      lesson: params.module,
      state: params.state,
      timestamp: params.timestamp,
      uid:params.uid,
      pseudoname: params.username
    };
    return $config.storageSet(this.STORAGE_KEY,this.progressionState)
  }

  async sync() {
    const user = await $user.get();
    //
    // reset
    this.progressionState = {};

    //
    // basic check
    if(!user.id) {
      throw new Error('Unauthorized sync()')
    }

    //
    // load Airtable usage
    try{
      const res= await axios.get("/event?filter=" + user.id, defaultAxios);
      console.log('-- DBG',res);
      return res;
    }catch(e){
      console.error("unable to sync events", e);
      return null;
    }
  }
}

//
// service start with $
export const $metric = new MetricService();