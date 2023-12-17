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
      <ion-list>
        <ion-item v-for="t in tokens">
          <ion-label>
            <ion-text color="danger">
              <h3>🪙{{ t.Token.Symbol }}</h3>
            </ion-text>
            <p>Minted:{{ t.Minted }}</p>
            <p>PreLimit:{{ t.Token.PreLimit }}</p>
            <p>TotalSupply:{{ t.Token.TotalSupply }}</p>
            <p>deployer:{{ t.DeployAddr }}</p>
          </ion-label>

          <ion-button
            color="danger"
            @click="mintClick(t.Token.Symbol, t.Token.PreLimit)"
            >Mint</ion-button
          >
        </ion-item>
      </ion-list>
      <ion-modal :is-open="isOpen" @didDismiss="closeMint">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ mintData.symbol }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeMint"> close </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item>
              <ion-card style="width: 100%; border">
                <ion-card-content>
                  <ion-input
                    label="amount"
                    type="number"
                    :placeholder="mintData.amount"
                    v-model="mintData.amount"
                  ></ion-input>

                  <ion-input
                    label="address"
                    :placeholder="mintData.reciveAddr"
                    v-model="mintData.reciveAddr"
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
                      <p>Service Base Fee:4999 sats</p>
                      <br />
                    </ion-item>
                    <ion-item>
                      <p>
                        Total: ~ {{ feeRates[feeRate] * 201 + 4999 + 546 }}sats
                      </p>
                      <br />
                    </ion-item>
                    <ion-item>
                      <ion-button
                        size="default"
                        style="width: 100%"
                        color="danger"
                        id="mint-button"
                        @click="startMint"
                        >mint</ion-button
                      >
                    </ion-item>
                  </ion-list>

                  <ion-loading
                    trigger="mint-button"
                    :duration="5000"
                    :message="loadingMsg"
                  >
                  </ion-loading>
                </ion-card-content>
              </ion-card>
            </ion-item>
          </ion-list>
          <!-- <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum
            quidem recusandae ducimus quos reprehenderit. Veniam, molestias
            quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui.
            Eaque, dicta.
          </p> -->
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="javascript">
import {
  IonText,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonModal,
  IonButton,
  IonInput,
  IonCard,
  IonGrid,
  IonCol,
  IonAvatar,
  IonCardContent,
  toastController,
  IonCardHeader,
  IonList,
  IonItem,
  IonIcon,
  IonRange,
  IonLoading,
} from "@ionic/vue";

import { closeCircleSharp } from "ionicons/icons";
import axios from "axios";
import { mintPsbt } from "../script/psbt.js";
import { getFeeRates, getTxHex, getUnspentUtxo } from "../script/mempool.js";
import { connectUnisatWallet } from "@/script/unisat.js";
// import {Buffer} from "buffer";
export default {
  components: {
    IonRange,
    IonText,
    IonAvatar,
    IonLoading,
    IonPage,
    IonInput,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonIcon,
    IonItem,
    IonCard,
    IonGrid,
    IonCol,
    IonCardContent,
    IonCardHeader,
    IonModal,
  },

  data() {
    return {
      xxx: "123",
      currentAddr: "not connected",
      tokens: [],
      loadingMsg: "find utxo, wait a few second!",
      scriptFee: 546,
      vByte: 310,
      serviceFee: 4999,
      feeRates: [],
      feeRate: 1,
      mintData: {
        symbol: "",
        amount: "",
        reciveAddr: "",
        feeRate: 0,
      },
      isOpen: false,
    };
  },
  mounted() {
    axios
      .get("/api/token")
      .then((response) => {
        this.tokens = response.data.data;
        console.log(response.data);
      })
      .catch(function (error) {
        // 请求失败处理
        console.log(error);
      });
    connectUnisatWallet(this.syncWalletInfo);
  },
  methods: {
    syncWalletInfo: function () {
      var addr = localStorage.getItem("currentAddr");
      if (localStorage.getItem("currentAddr") == null) {
        return "connect";
      }
      this.currentAddr = addr;
    },

    mintClick: async function (symbol, amount) {
      this.isOpen = true;
      this.mintData.symbol = symbol;
      this.mintData.amount = amount;
      this.mintData.reciveAddr = this.currentAddr;
      await connectUnisatWallet(this.syncWalletInfo);
      toastController.create({
        message: "Hello World!",
        duration: 20000,
        position: "middle",
      });
      this.feeRates = await getFeeRates();
    },
    closeMint: function () {
      this.isOpen = false;
      console.log(this.mintData);
    },
    getMintPsbt: function (utxos, fee, symbol, amount, senderAddr, reciveAddr) {
      axios
        .post("/api/psbt/mint", {
          inputs: utxos,
          fee: fee,
          reciveAddr: reciveAddr,
          senderAddr: senderAddr,
          symbol: symbol,
          amount: amount,
        })
        .then(function (response) {
          if (response.data.code == 0) {
            if (window.unisat != undefined) {
              window.unisat.signPsbt(response.data.psbt).then((res) => {
                window.unisat.pushPsbt(res);
              });
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    startMint: async function () {
      var utxos = await getUnspentUtxo(this.currentAddr);
      console.log(utxos);
      var fee =
        this.feeRates[this.feeRate] * this.vByte +
        this.serviceFee +
        this.scriptFee;
      var selectUtxos = [];
      for (let i = 0; i < utxos.length; i++) {
        var item = utxos[i];
        console.log(item);
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
      var mintPsbtHex = mintPsbt(
        selectUtxos,
        fee,
        this.mintData.symbol,
        this.mintData.amount,
        this.currentAddr,
        this.mintData.reciveAddr
      );
      if (window.unisat != undefined) {
        console.log(mintPsbtHex);
        window.unisat.signPsbt(mintPsbtHex).then((res) => {
          window.unisat.pushPsbt(res);
        });
      }
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

  user-select: None;
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

.circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
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