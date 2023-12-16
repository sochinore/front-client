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
          <ion-label :icon="logoBitcoin" color="danger">{{
            currentAddr
          }}</ion-label>
        </ion-chip>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-text color="danger" >
          <h1 style="display: flex;justify-content: center; align-items: center;">🔧the market is comming soon</h1>
      </ion-text>
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
import axios from "axios";
export default {
  components: {
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
      currentAddr: "not connected",
    };
  },
  mounted() {
    try {
      window.unisat
        .requestAccounts()
        .then((accounts) => {
          this.currentAddr = accounts[0];
          console.log("connect success", accounts);
        })
        .catch(function (error) {
          // 请求失败处理
          console.log(error);
        });
    } catch (error) {}
  },
};
</script>
