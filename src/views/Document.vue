<template>
  <ion-page>
    <ion-header>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
      </ion-header>

      <div class="crossnote markdown-preview">
        <h1 id="hg-protocol">HG protocol</h1>
        <h2 id="what-is-the-hg-protocol">What is the HG Protocol?</h2>
        <p>
          The HG protocol is a ledger agreement based on BTC; It does not rely
          on UTXO, isolation witnessing, or taproot; Even without the
          aforementioned items, we can still issue assets or transfer them at
          BTC;
        </p>
        <h2 id="protocol-format">protocol format</h2>
        <pre
          data-role="codeBlock"
          data-info="shell"
          class="language-shell shell"
        ><code>OP_RETURN
OP_PUSHBYTES_3 <span class="token number">686770</span> <span class="token comment">#"hgp"</span>
OP_PUSHNUM_0          <span class="token comment"># input index</span>
OP_PUSHNUM_1          <span class="token comment"># output index</span>
OP_0                  <span class="token comment"># opcode</span>
OP_PUSHBYTES_3 <span class="token number">686770</span> <span class="token comment"># token name</span>
param_0
<span class="token punctuation">..</span><span class="token punctuation">..</span>
param_n
</code></pre>
        <h2 id="opcode">opcode</h2>
        <h3 id="deploy-opcode-0">DEPLOY OPCODE 0</h3>
        <p>DEPLOY OPCODE: Deploy an asset on top of BTC</p>
        <p>The deploy instruction is 0, which requires 6 parameters：</p>
        <ul>
          <li>param 0: is need bitwork 0 or !0</li>
          <li>param 1: pre limit</li>
          <li>param 2: total supply</li>
          <li>param 3: mint start block</li>
          <li>param 4: mint end block</li>
          <li>param 5: bitwork(hex) prefix</li>
        </ul>
        <p>Here is a complete instance of deploying HGP:</p>
        <pre
          data-role="codeBlock"
          data-info="shell"
          class="language-shell shell"
        ><code>    OP_RETURN
    OP_PUSHBYTES_3 <span class="token number">686770</span>
    OP_0
    OP_PUSHNUM_1
    OP_0
    OP_PUSHBYTES_3 <span class="token number">686770</span>
    OP_0
    OP_PUSHBYTES_2 03e8
    OP_PUSHBYTES_6 5af3107a4000
    OP_PUSHBYTES_3 26cac0
    OP_PUSHBYTES_3 26cea8
    OP_0
</code></pre>
        <h3 id="mint-opcode-1">MINT OPCODE 1</h3>
        <p>MINT OPCODE: mint token</p>
        <p>The MINT instruction is 1, which requires 2 parameters：</p>
        <ul>
          <li>param 0: mint amount</li>
          <li>
            param 1: bitwork nonce (if bitwork is not needed, please fill 0)
          </li>
        </ul>
        <p>Here is a complete instance of mint HGP:</p>
        <pre
          data-role="codeBlock"
          data-info="shell"
          class="language-shell shell"
        ><code>  OP_RETURN
  OP_PUSHBYTES_3 <span class="token number">686770</span>
  OP_0
  OP_PUSHNUM_1
  OP_PUSHNUM_1  <span class="token comment"># mint opcode</span>
  OP_PUSHBYTES_3 <span class="token number">686770</span>
  OP_PUSHBYTES_2 03e8
  OP_PUSHBYTES_2 00000
</code></pre>
        <h3 id="transfer-opcode-2">TRANSFER OPCODE 2</h3>
        <p>The TRANSFER instruction is 2, which requires 1 parameters：</p>
        <ul>
          <li>param 0: transfer amount</li>
        </ul>
        <p>Here is a complete instance of transfer 1000 HGP:</p>
        <pre
          data-role="codeBlock"
          data-info="shell"
          class="language-shell shell"
        ><code>  OP_RETURN
  OP_PUSHBYTES_3 <span class="token number">686770</span>
  OP_0
  OP_PUSHNUM_1
  OP_PUSHNUM_2  <span class="token comment"># transfer opcode</span>
  OP_PUSHBYTES_3 <span class="token number">686770</span>
  OP_PUSHBYTES_2 03e8
</code></pre>
        <h3 id="lock-opcode-3">LOCK OPCODE 3</h3>
        <p>LOCK :Lock some tokens into UTXO, usually used for swap</p>
        <p>The LOCK instruction is 3, which requires 1 parameters：</p>
        <ul>
          <li>param 0: lock amount</li>
        </ul>
        <p>Here is a complete instance of lock 1000 HGP:</p>
        <pre
          data-role="codeBlock"
          data-info="shell"
          class="language-shell shell"
        ><code>  OP_RETURN
  OP_PUSHBYTES_3 <span class="token number">686770</span>
  OP_0
  OP_PUSHNUM_1
  OP_PUSHNUM_2  <span class="token comment"># transfer opcode</span>
  OP_PUSHBYTES_3 <span class="token number">686770</span>
  OP_PUSHBYTES_2 03e8
</code></pre>
        <h3 id="unlock-opcode-4">UNLOCK OPCODE 4</h3>
        <p>UNLOCK :Unlocking tokens from UTXO, typically used for swap</p>
        <p>The LOCK instruction is 4, which requires 0 parameters：</p>
        <p>Here is a complete instance of unlock HGP:</p>
        <pre
          data-role="codeBlock"
          data-info="shell"
          class="language-shell shell"
        ><code>  OP_RETURN
  OP_PUSHBYTES_3 <span class="token number">686770</span>
  OP_0
  OP_PUSHNUM_1
  OP_PUSHNUM_2  <span class="token comment"># transfer opcode</span>
  OP_PUSHBYTES_3 <span class="token number">686770</span>
</code></pre>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import ExploreContainer from "@/components/ExploreContainer.vue";
</script>
