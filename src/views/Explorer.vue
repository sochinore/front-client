<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-text slot="start" color="danger">
          <h1>HG Protocol</h1>
        </ion-text>
        <ion-chip slot="end" id="present-alert" @click="connectWallet()">
          <ion-avatar >
            <img alt="Silhouette of a person's head" src="/bitcoin.svg" />
          </ion-avatar>
          <ion-label color="danger">{{
            currentAddr
          }}</ion-label>
        </ion-chip>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-searchbar
        showCancelButton="focus"
        class="custom"
        placeholder="address?txid?token"
      >
      </ion-searchbar>
      <ion-list>
        <ion-item>
          <ion-label>
            <ion-text color="danger">
              <h1>Latest Transactions</h1>
            </ion-text>
          </ion-label>
        </ion-item>
        <ion-item v-for="e in events">
          <ion-label >
            <ion-text color="danger">
              <p>block:{{ e.Block }}</p>
              <h3>{{ e.EventId }}</h3>
            </ion-text>
            <p  >🪙Token:{{ e.Data.Symbol }}</p>
            <p>🔧OP:{{ e.Data.OP }}</p>
            <p>From:{{ e.Data.From }}</p>
            <p>To:{{ e.Data.To }}</p>
            <p v-if="e.Data.OP != 'deploy'">amount:{{ e.Data.Amount }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="javascript">
import {
  IonPage,
  IonChip,
  IonAvatar,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  IonContent,
} from "@ionic/vue";
import { logoBitcoin } from "ionicons/icons";
import { connectUnisatWallet, requestAccounts } from "../script/unisat.js";
import axios from "axios";
export default {
  components: {
    logoBitcoin,
    IonPage,
    IonChip,
    IonAvatar,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonHeader,
    IonToolbar,
    IonSearchbar,
    IonTitle,
    IonContent,
  },

  data() {
    return {
      currentAddr: "connect",
      xxx: "123",
      events: [],
    };
  },
  methods: {
    connectWallet: function() {
      requestAccounts(this.syncWalletInfo);
      this.syncWalletInfo()
    },
    syncWalletInfo:function(){
      var addr = localStorage.getItem("currentAddr")
      if(localStorage.getItem("currentAddr") == null){
        return "connect"
      }
      this.currentAddr = addr;
      console.log("syncWalletInfo",this.currentAddr)
    }
  },
  mounted() {
    axios
      .get("/api/event/pending")
      .then((response) => {
        this.events = response.data.data;
        console.log(response.data);
      })
      .catch(function (error) {
        // 请求失败处理
        console.log(error);
      });
    // if(localStorage.getItem("connected")){
    connectUnisatWallet(this.syncWalletInfo);
    // }
    this.syncWalletInfo();
  },
};
</script>
