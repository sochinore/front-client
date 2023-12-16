<template>
  <ion-page class="root">
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="explorer" href="/explorer">
          <ion-icon aria-hidden="true" :icon="analytics" />
          <ion-label>transactions</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="market" href="/market">
          <ion-icon aria-hidden="true" :icon="storefront" />
          <ion-label>market</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="token" href="/token">
          <ion-icon aria-hidden="true" :icon="logoBitcoin"/>
          <ion-label>tokens</ion-label>
        </ion-tab-button> 

        <ion-tab-button tab="wallet" href="/wallet">
          <ion-icon aria-hidden="true" :icon="wallet" />
          <ion-label>wallet tools</ion-label>
        </ion-tab-button>


        <ion-tab-button tab="document" href="/document">
          <ion-icon aria-hidden="true" :icon="document" />
          <ion-label>document</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, wallet, storefront, analytics,document,logoBitcoin } from 'ionicons/icons';

</script>

<style scoped>
.root {
	--ion-background-color: #fff1f1;
	--ion-background-color-rgb: 255,255,255;
  --ion-tab-bar-color-selected: #f50101;
}
</style>