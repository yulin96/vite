<template>
  <transition name="slide-up" mode="out-in">
    <slot></slot>
  </transition>
</template>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
  position: relative;
}

.slide-up-enter-from {
  filter: blur(20px);
  opacity: 0;
  transform: translateY(30px) translateZ(0);
}

.slide-up-leave-to {
  filter: blur(20px);
  opacity: 0;
  transform: translateY(-30px) translateZ(0);
}
</style>
