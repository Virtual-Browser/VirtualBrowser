<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <el-popover placement="right" trigger="click">
      <div class="qq-group">
        <img src="@/assets/VirtualBrowser-qq-group.png" />
        <p>
          QQ Group:
          <code>564142956</code>
        </p>
      </div>
      <div slot="reference" class="about-us">关于我们</div>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>
.about-us {
  padding: 12px;
  text-align: center;
  border-radius: 26px;
  font-size: 14px;
  color: #664100;
  background: linear-gradient(90deg, #ffeccc, #ffd080);
  margin: 5px 5px 0 5px;
  cursor: pointer;
}
.qq-group {
  p {
    margin-top: -5px;
    margin-left: 18px;
    font-size: 13px;
  }
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    font-size: 120%;
    white-space: break-spaces;
    background-color: rgba(175, 184, 193, 0.2);
    border-radius: 6px;
  }
}
</style>
