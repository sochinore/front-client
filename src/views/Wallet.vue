<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-text slot="start" color="danger">
          <h1>HG Protocol</h1>
        </ion-text>
        <ion-chip slot="end">
          <ion-avatar>
            <img alt="Silhouette of a person's head" src="/bitcoin.svg" />
          </ion-avatar>
          <ion-label color="danger">{{ currentAddr }}</ion-label>
        </ion-chip>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense"> </ion-header>
      <ion-list v-if="!connectd">
        <ion-list-header>
          <ion-skeleton-text
            :animated="true"
            style="width: 80px"
          ></ion-skeleton-text>
        </ion-list-header>
        <ion-item>
          <ion-thumbnail slot="start">
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </ion-thumbnail>
          <ion-label>
            <h3>
              <ion-skeleton-text
                :animated="true"
                style="width: 80%"
              ></ion-skeleton-text>
            </h3>
            <p>
              <ion-skeleton-text
                :animated="true"
                style="width: 60%"
              ></ion-skeleton-text>
            </p>
            <p>
              <ion-skeleton-text
                :animated="true"
                style="width: 30%"
              ></ion-skeleton-text>
            </p>
          </ion-label>
        </ion-item>
      </ion-list>

      <div class="wrapper" v-if="!connectd">
        <b>please connect your wallet</b>
        <div
          class="ion-activatable ripple-parent custom-parent"
          @click="connectdUnisat"
        >
          unisat wallet
          <ion-ripple-effect></ion-ripple-effect>
        </div>

        <div class="ion-activatable ripple-parent">
          atom wallet
          <ion-ripple-effect class="custom-ripple"></ion-ripple-effect>
        </div>
      </div>
      <div v-if="connectd">
        <div v-if="select_value == 'balance'">
          <ion-grid>
            <ion-row>
              <ion-col size="12" size-sm="4" v-for="(k, v) in balances">
                <ion-card>
                  <ion-card-header>
                    <ion-card-title color="danger"
                      ><h3>🪙 {{ v }}</h3></ion-card-title
                    >
                  </ion-card-header>
                  <ion-card-content>
                    <ion-card-subtitle>balance: {{ k[0] }}</ion-card-subtitle>
                    <ion-card-subtitle>cheques: {{ k[1] }}</ion-card-subtitle>
                    <ion-button size="small" color="danger" @click="chequeClick(v, 0)">cheque</ion-button>
                    <ion-button size="small" color="danger">trade</ion-button>
                    <ion-button size="small" color="danger" @click="transferClick(v, 0)"
                      >transfer</ion-button
                    >
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

      </div>

      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ modalTitle +":"+transferData.symbol}}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal"> close </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list >
            <ion-item>
              <ion-card style="width: 100%; border">
                <ion-card-content>
                  <ion-input
                    label="amount"
                    type="number"
                    :placeholder="transferData.amount"
                    v-model="transferData.amount"
                  ></ion-input>

                  <ion-input
                    label="address"
                    :placeholder="transferData.reciveAddr"
                    v-model="transferData.reciveAddr"
                  >
                  </ion-input>
                </ion-card-content>
              </ion-card>
            </ion-item>

            <ion-item>
              <ion-card style="width: 100%">
                <ion-card-header>
                  <ion-card-subtitle
                    >Select the network fee you want to pay:</ion-card-subtitle
                  >
                </ion-card-header>
                <ion-card-content>
                  <ion-grid>
                    <ion-row>
                      <ion-col>
                        <div
                          v-on:click="feeRate = 0"
                          class="ion-activatable ripple-parent rounded-rectangle"
                          v-bind:class="{
                            'rounded-rectangle': feeRate != 0,
                            'select-rounded-rectangle': feeRate == 0,
                          }"
                        >
                          normal<br />
                          {{ feeRates[0] }}sats/vb
                          <ion-ripple-effect></ion-ripple-effect></div
                      ></ion-col>
                      <ion-col
                        ><div
                          v-on:click="feeRate = 1"
                          class="ion-activatable ripple-parent rounded-rectangle"
                          v-bind:class="{
                            'rounded-rectangle': feeRate != 1,
                            'select-rounded-rectangle': feeRate == 1,
                          }"
                        >
                          fast<br />
                          {{ feeRates[1] }}sats/vb
                          <ion-ripple-effect></ion-ripple-effect></div
                      ></ion-col>
                      <ion-col>
                        <div
                          v-on:click="feeRate = 2"
                          class="ion-activatable ripple-parent"
                          v-bind:class="{
                            'rounded-rectangle': feeRate != 2,
                            'select-rounded-rectangle': feeRate == 2,
                          }"
                        >
                          Custom<br />
                          {{ feeRates[2] }}sats/vb
                          <ion-ripple-effect></ion-ripple-effect></div
                      ></ion-col>
                    </ion-row>
                    <ion-range
                      v-if="feeRate == 2"
                      aria-label="fee rate"
                      :min="feeRates[0]"
                      :max="feeRates[1] + 40"
                      v-model="feeRates[2]"
                      :value="feeRates[0]"
                      :pin="true"
                      :ticks="true"
                      :snaps="true"
                    ></ion-range>
                  </ion-grid>

                  <ion-list>
                    <ion-item>
                      <p>Sats In Inscription: 546 sats</p>
                      <br />
                    </ion-item>
                    <ion-item>
                      <p>
                        Estimate Network Fee: ~{{ feeRates[feeRate] * vByte }}
                        sats
                      </p>
                      <br />
                    </ion-item>
                    <ion-item>
                      <p>
                        Total: ~ {{ feeRates[feeRate] * vByte + 546 }}sats
                      </p>
                      <br />
                    </ion-item>
                    <ion-item>
                      <ion-button
                        size="default"
                        style="width: 100%"
                        color="danger"
                        id="modal-button"
                        @click="startTransfer"
                        >{{modalTitle}}</ion-button
                      >
                    </ion-item>
                  </ion-list>

                  <ion-loading
                    trigger="modal-button"
                    :duration="5000"
                    :message="loadingMsg"
                  >
                  </ion-loading>
                </ion-card-content>
              </ion-card>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="javascript">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
    IonInput,
  IonText,
  IonAvatar,
  IonContent,
  IonRippleEffect,
  IonCard,
  IonCol,
  IonRow,
  IonLabel,
  IonChip,
  IonGrid,
  IonButton,
  IonLoading,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonModal,IonRange
} from "@ionic/vue";
import ExploreContainer from "@/components/ExploreContainer.vue";
import axios from "axios";
import { connectUnisatWallet, requestAccounts } from "@/script/unisat";
import { getFeeRates, getTxHex, getUnspentUtxo } from '@/script/mempool';
import { chequePsbt, transferPsbt } from '@/script/psbt';
export default {
  components: {
    IonText,
    IonRange,
    IonModal,
    IonLoading,
    IonCol,
    IonGrid,
    IonRow,
    IonAvatar,
    IonLabel,
    IonButton,
    IonChip,
    IonInput,
    IonAvatar,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonHeader,
    IonRippleEffect,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
  },

  data() {
    return {
      isModalOpen: false,
      modalTitle: "transfer",
      select_value: "balance",
      select_tool: "mint",
      vByte: 301,
      connectd: false,
      currentAddr: "not connected",
      transferData:{
        op:"transfer",
        amount:1000,
        symbol:"",
        reciveAddr:"",
      },
      loadingMsg: "find utxos, please wait a few second",
      feeRates:[1,1,1],
      scriptFee:546,
      feeRate:0,
      balances: {},
      tokens: [],
    };
  },

  mounted() {
    connectUnisatWallet(this.syncWalletInfo);
    if (this.connectd) {
      this.initData();
    }
  },

  methods: {
    startTransfer: async function () {
      var utxos = await getUnspentUtxo(this.currentAddr);
      var fee = this.feeRates[this.feeRate] * this.vByte + this.scriptFee;
      var selectUtxos = [];
      for (let i = 0; i < utxos.length; i++) {
        var item = utxos[i];
        if (item.value > fee) {
          selectUtxos.push({
            value: item.value,
            vout: item.vout,
            txid: item.txid,
            raw: await getTxHex(item.txid),
          });
          break;
        }
      }
      console.log("selectUtxos:", selectUtxos)

      var psbtHex = "";
      this.loadingMsg = "build psbt...."
      this.transferData.amount = Number(this.transferData.amount)
      if(this.transferData.op == "transfer"){
       psbtHex = transferPsbt(
        selectUtxos,
        fee,
        this.transferData.symbol,
        this.transferData.amount,
        this.currentAddr,
        this.transferData.reciveAddr
      );
      }
      if(this.transferData.op == "cheque"){
       psbtHex = chequePsbt(
        selectUtxos,
        fee,
        this.transferData.symbol,
        this.transferData.amount,
        this.currentAddr,
        this.transferData.reciveAddr
      );
      }
      this.loadingMsg = "please sign...."
      if (window.unisat != undefined) {
        window.unisat.signPsbt(psbtHex).then((res) => {
          window.unisat.pushPsbt(res);
        });
      }
    },

   chequeClick: async function (symbol, amount) {
      this.modalTitle = "cheque"
      this.transferData.amount = 0
      this.transferData.op = "cheque"
      this.transferData.reciveAddr = this.currentAddr
      this.transferData.symbol = symbol
      await connectUnisatWallet(this.syncWalletInfo)
      if(this.connectd){
        this.feeRates = await getFeeRates()
        this.isModalOpen = true;
      }
    },
    transferClick: async function (symbol, amount) {
      this.modalTitle = "transfer"
      this.transferData.amount = 0
      this.transferData.symbol = symbol
      await connectUnisatWallet(this.syncWalletInfo)
      if(this.connectd){
        this.feeRates = await getFeeRates()
        this.isModalOpen = true;
      }
    },
    closeModal: function () {
      this.isModalOpen = false;
      console.log(this.transferData);
    },
    syncWalletInfo: function () {
      var addr = localStorage.getItem("currentAddr");
      if (localStorage.getItem("currentAddr") == null) {
        return "connect";
      }
      this.connectd = true;
      this.currentAddr = addr;
    },
    initData: function () {
      var url = "/api/account/" + this.currentAddr;
      axios
        .get(url)
        .then((response) => {
          this.balances = response.data.data;
          console.log(response.data);
        })
        .catch(function (error) {
          // 请求失败处理
          console.log(error);
        });
    },
    selectValueChange: function (e) {
      this.select_value = e.detail.value;
      console.log(this.select_value);
    },
    connectdUnisat: async function () {
      await requestAccounts();
      this.initData();
    },
  },
};
</script>

<style scoped>
ion-modal {
  --color: white;
  --border-radius: 0px;
  --background: rgb(77, 1, 1);
}

ion-modal::part(backdrop) {
  opacity: 1;
}

ion-modal ion-content {
  --background: rgb(77, 1, 1);
  --color: white;
}

ion-modal ion-content ion-card {
  --background: rgb(77, 1, 1);
  --color: white;
}
ion-modal ion-content ion-list {
  --background: rgb(77, 1, 1);
  --color: white;

    padding-left: 0;
    padding-right: 0;
    padding-top: 0px;
    padding-bottom: 0px;
}
ion-modal ion-content ion-item {
  --background: rgb(77, 1, 1);
  --color: white;
}

ion-modal ion-toolbar {
  --background: rgb(77, 1, 1);
  --color: white;
}

.wrapper {
  display: flex;
  flex-wrap: wrap;

  align-items: center;
  justify-content: space-between;
  text-align: center;

  height: 170px;
  width: 400px;

  margin: 0 auto;
}

b {
  width: 100%;
}

.ripple-parent {
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  overflow: hidden;

  border: 1px solid #ddd;
  user-select: none;
  width: 100%;
  height: 50px;
  border-radius: 8px;
}

.custom-parent {
  color: #de1e7e;
}

.custom-ripple {
  color: #501ace;
}

.rounded-rectangle {
  width: 100px;
  height: 75px;
  border-radius: 8px;
  color: antiquewhite;
}

.select-rounded-rectangle {
  width: 100px;
  height: 75px;
  border-radius: 8px;
  color: #ddd;
  background-color: #eb445a;
}
ion-range::part(tick) {
  background: #a2d2ff;
}

ion-range::part(tick-active) {
  background: #bde0fe;
}

ion-range::part(pin) {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: #eb445a;
  color: #fff;

  border-radius: 50%;
  transform: scale(1.01);

  top: -20px;

  min-width: 28px;
  height: 28px;
  transition: transform 120ms ease, background 120ms ease;
}

ion-range::part(pin)::before {
  content: none;
}

ion-range::part(knob) {
  background: #eb445a;
}

ion-range::part(bar) {
  background: #a2d2ff;
}

ion-range::part(bar-active) {
  background: #bde0fe;
}
</style>