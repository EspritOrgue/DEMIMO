import { MILID } from "@/models";
import Vue from "vue";
import axios from 'axios';


class ConfigService {
  // More about store
  // https://fr.vuejs.org/v2/guide/reactivity.html
  private _store: any;
  private _baseUrl = process.env.BASE_URL;
 
  constructor() {
    this._store = Vue.observable({
      config: {}
    });
  }

  get store() {
    return this._store;
  }

  async get(force?: boolean): Promise<MILID.Config> {
    if(!this._store.config.done && !force) {
      const res = await axios.get(this._baseUrl + 'config.json');
      this._store.config = res.data;
      this._store.config.done = true;
    }

    return this._store.config
  }  
}

//
// service start with $
export const $config = new ConfigService();