<template>
  <AppTab :title="metaName">
    <div class="flex flex-col gap-4 p-4">
      <div>open in editor to check the source code</div>
      <pre class="text-sm">
// ❌ Invalid
&lt;IonButton&gt;
  &lt;div slot=&quot;end&quot; class=&quot;mdi:heart&quot; /&gt;
      ^`slot` attributes are deprecated.eslintvue/no-deprecated-slot-attribute
&lt;/IonButton&gt;
        </pre>
      <IonButton>
        <IonIcon slot="end" :icon="ioniconsHeart" />
      </IonButton>
      <pre class="text-sm">
// ✅ ignored by config
&lt;IonButton&gt;
  &lt;IonIcon slot=&quot;end&quot; :icon=&quot;ioniconsHeart&quot; /&gt;
&lt;/IonButton&gt;
        </pre>
      <IonButton>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <div slot="start">
          ❤️
        </div>
      </IonButton>
      <pre class="text-sm">
// ✅ &lt;!-- eslint-disable-next-line --&gt;
&lt;IonButton&gt;
  &lt;!-- eslint-disable-next-line --&gt;
  &lt;div slot=&quot;start&quot;&gt;
    ❤️
  &lt;/div&gt;
&lt;/IonButton&gt;
        </pre>
      <pre class="text-sm">
// ✅ &lt;!-- eslint-disable-next-line vue/no-deprecated-slot-attribute --&gt;
&lt;IonButton&gt;
  &lt;!-- eslint-disable-next-line vue/no-deprecated-slot-attribute --&gt;
  &lt;div slot=&quot;start&quot;&gt;
    ❤️
  &lt;/div&gt;
&lt;/IonButton&gt;
        </pre>
    </div>
  </AppTab>
</template>

<script lang="ts" setup>
const metaName = 'Web Component slot';
definePageMeta({ name: metaName });
</script>
