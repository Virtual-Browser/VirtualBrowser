<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleCreate"
        >
          {{ $t("browser.add") }}
        </el-button>
        <el-button class="filter-item" type="primary" @click="handleBatchStart">
          {{ $t("browser.batchStart") }}
        </el-button>
      </div>
      <div style="display: flex">
        <!-- <el-input
          v-model="listQuery.title"
          :placeholder="$t('browser.name')"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter">
          {{ $t('browser.search') }}
        </el-button> -->
        <el-upload
          action=""
          accept=".json"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onImport"
        >
          <el-button>{{ $t("browser.import.import") }}</el-button>
        </el-upload>
        <el-button style="margin-left: 10px" @click="onExport">{{
          $t("browser.import.export")
        }}</el-button>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="60" align="center" />
      <el-table-column
        :label="$t('browser.id')"
        prop="id"
        sortable
        align="center"
        width="80"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('browser.name')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('browser.ip_port')" width="200px">
        <template slot-scope="{ row }">
          <span>
            {{ row.proxy.protocol }}
            {{
              row.proxy.host && row.proxy.port
                ? " " + row.proxy.host + ":" + row.proxy.port
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('browser.date')"
        sortable
        prop="timestamp"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.timestamp | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('browser.launch')"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            icon="el-icon-video-play"
            :loading="row.runLoading"
            :disabled="row.isRunning"
            @click="handleLaunch(row)"
          >
            {{
              $t(
                row.runLoading
                  ? "browser.launching"
                  : row.isRunning
                    ? "browser.launched"
                    : "browser.launch"
              )
            }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('browser.actions')"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" @click="handleUpdate(row)">
            {{ $t("browser.edit") }}
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t("browser.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="qq-group">
      <img src="@/assets/VirtualBrowser-qq-group.png">
      <p>QQ Group: <code>564142956</code></p>
    </div>

    <el-dialog
      :title="$t(dialogStatus == 'create' ? 'browser.add' : 'browser.edit')"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      class="formDlg"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="left"
        label-width="100px"
      >
        <el-timeline>
          <el-timeline-item>
            <h3>{{ $t("browser.basic") }}</h3>
            <div>
              <el-form-item :label="$t('browser.name')" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item :label="$t('browser.platform')">
                <el-radio-group v-model="form.os">
                  <el-radio-button
                    v-for="item in platforms"
                    :key="item"
                    :label="item"
                  />
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('browser.version')">
                <el-select
                  v-model="form.chrome_version"
                  :placeholder="$t('browser.select')"
                >
                  <el-option
                    v-for="item in Versions"
                    :key="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('browser.proxy.setting')">
                <el-radio-group v-model="form.proxy.mode">
                  <el-radio-button :label="0">{{
                    $t("browser.default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.no_proxy")
                  }}</el-radio-button>
                  <el-radio-button :label="2">{{
                    $t("browser.custom")
                  }}</el-radio-button>
                </el-radio-group>
                <div v-if="form.proxy.mode == 2" style="margin-top: 10px">
                  <el-form-item
                    :label="$t('browser.proxy.protocol')"
                    label-width="70px"
                  >
                    <el-select
                      v-model="form.proxy.protocol"
                      style="width: 100px"
                    >
                      <el-option value="HTTP" />
                      <el-option value="HTTPS" />
                      <el-option value="SOCKS5" />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="$t('browser.proxy.host')"
                    label-width="70px"
                    prop="proxy.host"
                  >
                    <el-input
                      v-model="form.proxy.host"
                      style="max-width: 250px"
                    />
                    :
                    <el-input
                      v-model="form.proxy.port"
                      style="width: 70px"
                      :placeholder="$t('browser.proxy.port')"
                    />
                  </el-form-item>
                  <el-form-item
                    :label="$t('browser.proxy.user')"
                    label-width="70px"
                  >
                    <el-input
                      v-model="form.proxy.user"
                      style="max-width: 250px"
                    />
                  </el-form-item>
                  <el-form-item
                    :label="$t('browser.proxy.pass')"
                    label-width="70px"
                  >
                    <el-input
                      v-model="form.proxy.pass"
                      style="max-width: 250px"
                    />
                    &nbsp;
                    <el-button
                      type="primary"
                      style="margin-left: 7px"
                      :disabled2="checkProxyState.checking"
                      :loading="checkProxyState.checking"
                      @click="checkProxy"
                    >检测{{ checkProxyState.checking ? "中" : "" }}</el-button>
                  </el-form-item>
                  <!-- <el-form-item
                    :label="$t('browser.proxy.value')"
                    label-width="60px"
                    prop="proxy.value"
                  >
                    <el-input
                      v-model="form.proxy.value"
                      style="max-width: 250px"
                    />
                    <div class="tips" v-html="$t('browser.proxy_tips')" />
                  </el-form-item> -->
                </div>
              </el-form-item>
              <el-form-item
                :label="$t('browser.cookie.jsonStr')"
                prop="cookie.jsonStr"
              >
                <el-switch
                  v-model="form.cookie.mode"
                  :active-value="1"
                  :inactive-value="0"
                />
                <div style="display: flex; align-items: flex-start">
                  <el-input
                    v-model="form.cookie.jsonStr"
                    type="textarea"
                    rows="6"
                    :placeholder="$t('browser.cookie.placeholder')"
                    :disabled="form.cookie.mode === 0"
                  />
                  <el-button
                    type="text"
                    style="margin: -5px 0 0 5px"
                    @click="dialogCookieFormatVisible = true"
                  >
                    {{ $t("browser.cookie.format") }}
                  </el-button>
                </div>
              </el-form-item>
            </div>
          </el-timeline-item>
          <el-timeline-item>
            <h3>{{ $t("browser.advanced") }}</h3>
            <div>
              <el-form-item :label="$t('browser.ua')">
                <el-radio-group v-model="form.ua.mode">
                  <el-radio-button :label="0">{{
                    $t("browser.default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.custom")
                  }}</el-radio-button>
                </el-radio-group>
                <el-input
                  v-model="form.ua.value"
                  :disabled="form.ua.mode === 0"
                  type="textarea"
                  style="margin-top: 3px"
                />
              </el-form-item>
              <el-form-item :label="$t('browser.sec_ua')">
                <el-radio-group v-model="form['sec-ch-ua'].mode">
                  <el-radio-button :label="0">{{
                    $t("browser.default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.custom")
                  }}</el-radio-button>
                </el-radio-group>
                <div
                  v-show="form['sec-ch-ua'].mode === 1"
                  class="custom-sec-ua"
                >
                  <div v-for="(item, i) in form['sec-ch-ua'].value" :key="i" class="item">
                    <el-form-item label="brand: " label-width="42px">
                      <el-input v-model="item.brand" />
                    </el-form-item>
                    <el-form-item label="version: " label-width="52px">
                      <el-input v-model="item.version" style="width: 60px" />
                    </el-form-item>
                    <el-button
                      type="danger"
                      icon="el-icon-minus"
                      circle
                      @click="onRemoveBrand(item.brand)"
                    />
                  </div>
                  <div class="item">
                    <el-form-item
                      label="brand: "
                      label-width="42px"
                      style="visibility: hidden"
                    >
                      <el-input />
                    </el-form-item>
                    <el-form-item
                      label="version: "
                      label-width="52px"
                      style="visibility: hidden"
                    >
                      <el-input style="width: 60px" />
                    </el-form-item>
                    <el-button
                      type="success"
                      icon="el-icon-plus"
                      circle
                      @click="onAddBrand()"
                    />
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="$t('browser.language')">
                <el-switch
                  v-model="form['ua-language'].mode"
                  :active-value="2"
                  :inactive-value="1"
                />
                <span style="margin-left: 10px">{{
                  $t("browser.language_tips")
                }}</span>
                <el-select
                  v-if="form['ua-language'].mode == 1"
                  v-model="form['ua-language'].language"
                  :placeholder="$t('browser.select')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, i) in Languages"
                    :key="i"
                    :label="
                      (language == 'zh' ? item.lang : item.en) +
                        '    ' +
                        item.code
                    "
                    :value="item.code"
                  >
                    <span style="float: left">{{
                      language == "zh" ? item.lang : item.en
                    }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ item.code }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('browser.timezone')">
                <el-switch
                  v-model="form['time-zone'].mode"
                  :active-value="2"
                  :inactive-value="1"
                />
                <span style="margin-left: 10px">{{
                  $t("browser.timezone_tips")
                }}</span>
                <el-select
                  v-if="form['time-zone'].mode == 1"
                  v-model="form['time-zone'].name"
                  :placeholder="$t('browser.select')"
                  style="width: 100%"
                  @change="
                    (select) => {
                      const selItem = TimeZones.find(
                        (item) => item.text == select
                      );
                      form['time-zone'].value = selItem.offset;
                      form['time-zone'].zone = getZone(selItem.offset);
                    }
                  "
                >
                  <el-option
                    v-for="(item, i) in TimeZones"
                    :key="i"
                    :value="item.text"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('browser.webrtc')">
                <el-radio-group v-model="form.webrtc.mode">
                  <el-radio-button :label="0">{{
                    $t("browser.replace")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.allow")
                  }}</el-radio-button>
                  <el-radio-button :label="2">{{
                    $t("browser.block")
                  }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('browser.location')">
                <el-radio-group v-model="form.location.enable">
                  <el-radio-button label="0">{{
                    $t("browser.ask")
                  }}</el-radio-button>
                  <el-radio-button label="1">{{
                    $t("browser.allow")
                  }}</el-radio-button>
                  <el-radio-button label="2">{{
                    $t("browser.block")
                  }}</el-radio-button>
                </el-radio-group>
                <div v-if="form.location.enable != 2">
                  <el-switch
                    v-model="form.location.mode"
                    :active-value="2"
                    :inactive-value="1"
                  />
                  <span style="margin-left: 10px">{{
                    $t("browser.location_tips")
                  }}</span>
                  <div v-if="form.location.mode == 1">
                    <el-form-item
                      :label="$t('browser.longitude')"
                      label-width="80px"
                    >
                      <el-input
                        v-model="form.location.longitude"
                        style="width: 100px"
                      />
                    </el-form-item>
                    <el-form-item
                      :label="$t('browser.latitude')"
                      label-width="80px"
                    >
                      <el-input
                        v-model="form.location.latitude"
                        style="width: 100px"
                      />
                    </el-form-item>
                    <el-form-item
                      :label="$t('browser.precision')"
                      label-width="80px"
                    >
                      <el-input
                        v-model="form.location.precision"
                        style="width: 100px"
                      />
                    </el-form-item>
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="$t('browser.screen')">
                <el-radio-group v-model="form.screen.mode">
                  <el-radio-button :label="0">{{
                    $t("browser.system_match")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.custom")
                  }}</el-radio-button>
                </el-radio-group>
                <el-select
                  v-if="form.screen.mode === 1"
                  v-model="form.screen._value"
                  :placeholder="$t('browser.select')"
                  style="margin-left: 10px"
                >
                  <el-option
                    v-for="(item, i) in resolutionList"
                    :key="i"
                    :value="item"
                    :label="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('browser.fonts')">
                <el-radio-group v-model="form.fonts.mode">
                  <el-radio-button :label="0">{{
                    $t("browser.system_default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.random_match")
                  }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('browser.canvas')">
                <el-radio-group v-model="form.canvas.mode">
                  <el-radio-button :label="0">{{
                    $t("browser.default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.random")
                  }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('browser.webgl_img')">
                <el-radio-group v-model="form['webgl-img'].mode">
                  <el-radio-button :label="0">{{
                    $t("browser.default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.random")
                  }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('browser.webgl')">
                <el-radio-group v-model="form.webgl.mode">
                  <el-radio-button :label="0">{{
                    $t("browser.default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.custom")
                  }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <template v-if="form.webgl.mode == 1">
                <el-form-item :label="$t('browser.webgl_manu')">
                  <el-select
                    v-model="form.webgl.vendor"
                    :placeholder="$t('browser.select')"
                  >
                    <el-option
                      v-for="(item, i) in WebGLVendors"
                      :key="i"
                      :value="item"
                    />
                    <!-- <el-option value="Google Inc. (NVIDIA)" /> -->
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('browser.webgl_render')">
                  <el-select
                    v-model="form.webgl.render"
                    :placeholder="$t('browser.select')"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, i) in WebGLRenders"
                      :key="i"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </template>
              <el-form-item :label="$t('browser.audio')">
                <el-radio-group v-model="form['audio-context'].mode">
                  <el-radio-button :label="0">{{
                    $t("browser.default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.random")
                  }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <!-- <el-form-item :label="$t('browser.media')">
                <el-radio-group v-model="form.media.mode">
                  <el-radio-button :label="0">{{ $t('browser.default') }}</el-radio-button>
                  <el-radio-button :label="1">{{ $t('browser.random') }}</el-radio-button>
                </el-radio-group>
              </el-form-item> -->
              <el-form-item :label="$t('browser.client_rects')">
                <el-radio-group v-model="form['client-rects'].mode">
                  <el-radio-button :label="0">{{
                    $t("browser.default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.random")
                  }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('browser.speech_voices')">
                <el-radio-group v-model="form['speech_voices'].mode">
                  <el-radio-button :label="0">{{
                    $t("browser.default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.random")
                  }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('browser.cpu')">
                <el-select v-model="form.cpu.value" style="width: 60px">
                  <el-option :value="2" />
                  <el-option :value="4" />
                  <el-option :value="6" />
                  <el-option :value="8" />
                </el-select>
                &nbsp;
                <span>{{ $t("browser.cpu_unit") }}</span>
              </el-form-item>
              <el-form-item :label="$t('browser.memory')">
                <el-select v-model="form.memory.value" style="width: 60px">
                  <el-option :value="1" />
                  <el-option :value="2" />
                  <el-option :value="4" />
                  <el-option :value="8" />
                </el-select>
                &nbsp;
                <span>GB</span>
              </el-form-item>
              <el-form-item :label="$t('browser.device')" style="height: 36px">
                <el-radio-group v-model="form['device-name'].mode">
                  <el-radio-button :label="0">{{
                    $t("browser.default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.custom")
                  }}</el-radio-button>
                </el-radio-group>
                <div
                  v-if="form['device-name'].mode == 1"
                  style="display: inline-block"
                >
                  <el-input
                    v-model="form['device-name'].value"
                    style="width: 200px; margin-left: 10px"
                  />
                  <el-button type="text" @click="onReRandomComputerName">
                    {{ $t("browser.random_change") }}
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item :label="$t('browser.mac')" style="height: 36px">
                <el-radio-group v-model="form.mac.mode">
                  <el-radio-button :label="0">{{
                    $t("browser.default")
                  }}</el-radio-button>
                  <el-radio-button :label="1">{{
                    $t("browser.custom")
                  }}</el-radio-button>
                </el-radio-group>
                <div v-if="form.mac.mode == 1" style="display: inline-block">
                  <el-input
                    v-model="form.mac.value"
                    style="width: 200px; margin-left: 10px"
                  />
                  <el-button type="text" @click="onReRandomAddr">
                    {{ $t("browser.random_change") }}
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item :label="$t('browser.dnt')">
                <el-switch
                  v-model="form.dnt.value"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
              <el-form-item :label="$t('browser.ssl')">
                <el-radio-group v-model="form.ssl.mode">
                  <el-radio-button :label="1">{{
                    $t("browser.enable")
                  }}</el-radio-button>
                  <el-radio-button :label="0">{{
                    $t("browser.disable")
                  }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="form.ssl.mode == 1"
                :label="$t('browser.ssl_disabled')"
              >
                <el-checkbox-group v-model="form.ssl.value">
                  <el-checkbox
                    v-for="(val, key) in SSL"
                    :key="key"
                    :label="val"
                  >
                    {{ key }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item :label="$t('browser.port_scan')">
                <el-radio-group v-model="form['port-scan'].mode">
                  <el-radio-button :label="1">{{
                    $t("browser.enable")
                  }}</el-radio-button>
                  <el-radio-button :label="0">{{
                    $t("browser.disable")
                  }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="form['port-scan'].mode == 1"
                :label="$t('browser.enable_ports')"
              >
                <el-input
                  :value="form['port-scan'].value.join(',')"
                  :placeholder="$t('browser.enable_ports_tips')"
                  @input="
                    (value) => (form['port-scan'].value = value.split(','))
                  "
                  @change="
                    (value) =>
                      (form['port-scan'].value = value
                        .split(',')
                        .filter((item) => /^\d+$/.test(item)))
                  "
                />
              </el-form-item>
              <el-form-item :label="$t('browser.gpu')">
                <el-switch
                  v-model="form.gpu.value"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </div>
          </el-timeline-item>
          <el-timeline-item :hide-timestamp="true" />
        </el-timeline>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">
          {{ $t("browser.cancel") }}
        </el-button>
        <el-button
          type="primary"
          size="medium"
          @click="dialogStatus === 'create' ? onCreateData() : onUpdateData()"
        >
          {{ $t("browser.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogCookieFormatVisible"
      :title="$t('browser.cookie.format_title')"
      class="dialog-cookie"
    >
      <el-input v-model="cookieFormat" type="textarea" :rows="19" />
      <span slot="footer" class="dialog-footer">
        <el-tooltip
          v-model="copied"
          :manual="true"
          :hide-after="3000"
          :content="$t('browser.cookie.copied')"
          placement="top"
        >
          <el-button
            v-clipboard="() => cookieFormat"
            v-clipboard:success="onCopy"
            type="primary"
          >{{ $t("browser.cookie.copy") }}</el-button>
        </el-tooltip>
        <el-button @click="dialogCookieFormatVisible = false">{{
          $t("browser.cookie.close")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBrowserList,
  addBrowser,
  updateBrowser,
  deleteBrowser,
  chromeSend,
  chromeSendTimeout,
  updateRuningState,
} from '@/api/native'
import { saveAs } from 'file-saver'
import waves from '@/directive/waves' // waves directive
import random from 'random'
import {
  parseTime,
  genRandomMacAddr,
  genRandomComputerName,
  genRandomSpeechVoices,
  genUserAgent,
  loadScript,
} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TimeZones from '@/utils/timezones.json'
import Languages from '@/utils/languages.json'
import SSL from '@/utils/ssl.json'
import Versions from '@/utils/versions.json'
import uaFullVersions from '@/utils/ua-full-versions.json'
import WebGLRenders from '@/utils/webgl.json'
import { getFontList } from '@/utils/fonts'
import { compareVersions } from 'compare-versions'
import { login } from '@/api/user'

let IPGeo = {}
let fontList = []
let osVer = '10.0'
let chromeVer = ''; let uaFullVersion = ''
const sslList = ['0xc02c', '0xa02c', '0xb02c', '0xd02c', '0xe02c', '0xf02c']
let tooltipTimer
const chromiumCoreVer =
  Number(
    navigator.userAgentData.brands.find((item) => item.brand === 'Chromium')
      ?.version
  ) || 117
const coreVersions = Array.from(
  new Set(Versions.map((item) => Number(item.split('.')[0])))
)
for (let i = Math.max(...coreVersions) + 1; i <= chromiumCoreVer; i++) {
  coreVersions.unshift(i)
  Versions.unshift(`${i}.0.0.0`)
}

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data() {
    const validateCookie = (rule, value, callback) => {
      if (this.form.cookie.mode === 0) {
        this.form.cookie.value = ''
        callback()
        return
      }

      let json
      try {
        json = eval(`(${value})`)
      } catch {
        callback(new Error(this.$t('browser.cookie.format_error')))
        return
      }

      if (Object.prototype.toString.call(json) !== '[object Array]') {
        callback(new Error(this.$t('browser.cookie.format_error')))
        return
      }

      const setDefaultValue = (obj, key, value) => {
        if (obj[key] === undefined) {
          obj[key] = value
        }
      }

      json = json.map((item) => {
        const cookie = {}
        Object.keys(item).forEach((key) => {
          let newKey = key.substring(0, 1).toLowerCase() + key.substring(1)
          if (newKey === 'samesite') {
            newKey = 'sameSite'
          }
          cookie[newKey] = item[key]
        })

        setDefaultValue(cookie, 'sameSite', '')
        setDefaultValue(cookie, 'session', false)
        setDefaultValue(cookie, 'secure', false)
        setDefaultValue(cookie, 'httpOnly', false)

        return cookie
      })

      const checkNameValue = json.every((item) => {
        return item.name && item.value && item.domain
      })

      if (!checkNameValue) {
        callback(new Error(this.$t('browser.cookie.format_error')))
        return
      }

      // this.form.cookie.mode = 1
      this.form.cookie.value = json
      callback()
    }
    return {
      selectedRows: [],
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 5,
        title: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogCookieFormatVisible: false,
      textMap: {
        update: this.$t('browser.edit'),
        create: this.$t('browser.add'),
      },
      form: {
        proxy: {},
        cookie: {},
        ua: {},
        'ua-full-version': {},
        'sec-ch-ua': {},
        'ua-language': {},
        'time-zone': {},
        location: {},
        screen: {},
        fonts: {},
        canvas: {},
        'webgl-img': {},
        webgl: {},
        'audio-context': {},
        media: {},
        'client-rects': {},
        speech_voices: {},
        ssl: {},
        cpu: {},
        memory: {},
        'device-name': {},
        mac: {},
        dnt: {},
        'port-scan': {},
        gpu: {},
        webrtc: {},
      },
      rules: {
        // name: [{ required: true, message: this.$t('browser.required'), trigger: 'change' }],
        'proxy.value': [
          {
            required: true,
            message: this.$t('browser.required'),
            trigger: 'change',
          },
        ],
        'proxy.host': [
          {
            required: true,
            message: this.$t('browser.required'),
            trigger: 'change',
          },
        ],
        'cookie.jsonStr': [{ validator: validateCookie, trigger: 'blur' }],
      },
      downloadLoading: false,
      platforms: ['Win 7', 'Win 8', 'Win 10', 'Win 11'],
      WebGLVendors: Array.from(
        new Set(
          WebGLRenders.map(
            (item) => `Google Inc. (${item.match(/\((.+?),/)[1]})`
          )
        )
      ),
      WebGLRenders: WebGLRenders,
      resolutionList: [
        '800 x 600',
        '1024 x 768',
        '1280 x 720',
        '1280 x 800',
        '1280 x 960',
        '1280 x 1024',
        '1360 x 768',
        '1400 x 900',
        '1400 x 1050',
        '1600 x 900',
        '1600 x 1200',
        '1920 x 1080',
        '1920 x 1200',
        '2048 x 1152',
        '2304 x 1440',
        '2560 x 1440',
        '2560 x 1600',
        '2880 x 1800',
        '5120 x 2880',
      ],
      TimeZones,
      Languages,
      SSL,
      Versions: coreVersions,
      cookieFormat: `[{
	"name": "cookie1",
	"value": "1",
	"domain": ".xxx.com",
	"path": "/",
	"session": false,
	"httpOnly": false,
	"secure": false,
	"sameSite": "None"
}, {
	"name": "cookie2",
	"value": "2",
	"domain": ".xxx.com",
	"path": "/",
	"session": false,
	"httpOnly": false,
	"secure": false,
	"sameSite": "None"
}]`,
      copied: false,
      checkProxyState: {
        checking: false,
      },
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    },
  },
  watch: {
    'form.screen._value'(val) {
      const wh = val.split('x')
      this.form.screen.width = parseInt(wh[0])
      this.form.screen.height = parseInt(wh[1])
    },
    'form.chrome_version'(val) {
      if (val === '默认') {
        val = chromiumCoreVer
        this.form.ua.mode = 0
      } else {
        this.form.ua.mode = 1
      }

      // this.form[
      //   "sec-ch-ua"
      // ].value = `"Google Chrome";v="${val}", "Not(A:Brand";v="8", "Chromium";v="${val}"`;

      this.form['sec-ch-ua'].value.forEach((item) => {
        if (item.brand === 'Chromium') {
          item.version = val
        }
      })

      const curVers = Versions.filter((item) => Number(item.split('.')[0]) === val)
      chromeVer = curVers[random.int(0, curVers.length - 1)]
      uaFullVersion = uaFullVersions.find((item) => Number(item.split('.')[0]) === val) || chromeVer
      this.form.ua.value = genUserAgent(osVer, chromeVer)
      this.form['ua-full-version'].value = uaFullVersion
    },
    'form.os'(val) {
      switch (val) {
        case 'Win 7':
          osVer = '6.1'
          break
        case 'Win 8':
          osVer = '6.2'
          break
        case 'Win 10':
        case 'Win 11':
          osVer = '10.0'
          break
      }

      this.form.ua.value = genUserAgent(osVer, chromeVer)

      let vers = Array.from(
        new Set(Versions.map((item) => Number(item.split('.')[0])))
      )
      if (val === 'Win 7' || val === 'Win 8') {
        vers = vers.filter((item) => item <= 109)
      }
      vers.unshift('默认')
      this.Versions = vers
      if (!vers.includes(this.form.chrome_version)) {
        this.form.chrome_version = vers[0]
      }
    },
    'form.webgl.vendor'(val) {
      if (!val) {
        return
      }

      const vendor = val.match(/\((.+?)\)/)[1]
      this.WebGLRenders = WebGLRenders.filter(
        (item) => item.match(/\((.+?),/)[1] === vendor
      )
      const curVendor = this.form.webgl.render?.match(/\((.+?)\)/)[1]
      if (curVendor !== vendor) {
        this.form.webgl.render =
          this.WebGLRenders[random.int(0, this.WebGLRenders.length - 1)]
      }
    },
  },
  beforeCreate() {
    window._updateState = (runingIds) => {
      this.list = (this.list || []).map((item) => {
        item.isRunning = runingIds.includes(item.id.toString())
        if (item.isRunning) {
          item.runLoading = false
        }

        return item
      })
    }
  },
  async created() {
    await this.getList()

    this.$watch(
      () => this.form['ua-language'].language,
      (val) => {
        this.form['ua-language'].value = [val, val.split('-')[0]].join(',')
        this.form['time-zone'].locale = val
      }
    )

    let req = await fetch(
      'https://api.ipgeolocation.io/ipgeo?apiKey=36d02a0030f940e6a4922d553f2e3f00'
    )
    if (req.status === 429) {
      req = await fetch(
        'https://api.ipgeolocation.io/ipgeo?apiKey=c95cd9537ac64aecb9ebb33e033e65dd'
      )
    }
    const res = await req.json()
    IPGeo = res

    fontList = getFontList()

    const ver = await chromeSend('getBrowserVersion').catch((err) => {
      console.warn(err)
      return '1.116.0.0'
    })

    window._callback = (data) => {
      if (sessionStorage.getItem('check_update_showed') === '1') {
        return
      }
      if (compareVersions(ver, data.ver) >= 0) {
        return
      }

      sessionStorage.setItem('check_update_showed', 1)
      const update = data.update.map((item) => `<li>${item}</li>`).join('')
      this.$alert(
        `<div>版本：<b>${data.ver}</b></div>
         <div class="update">更新：<ol>${update}</ol></div>`,
        '发现新版本',
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          confirmButtonText: '更新',
        }
      )
        .then(() => {
          window.open(data.url)
        })
        .catch(() => {})
    }
    loadScript(
      `http://virtualbrowser.cc/update/check_update.js?c=${
        (this.list || []).length
      }&v=${ver}&t=${Date.now()}`
    )
  },
  methods: {
    async getList() {
      this.listLoading = true
      this.list = await getBrowserList()
      this.processUpdateData()
      await updateRuningState()
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    handleBatchStart() {
      for (let i = 0; i < this.selectedRows.length; i++) {
        const row = this.selectedRows[i]
        this.launchEnvironment(row, i * 2000)
      }
    },
    launchEnvironment(row, delay) {
      setTimeout(() => {
        this.handleLaunch(row)
      }, delay)
    },
    resetForm() {
      const ipGeoTimeZone = IPGeo.time_zone?.name

      // const currentZone = TimeZones.find((item) => item.utc.find((it) => it === ipGeoTimeZone))
      const currentZone = TimeZones.find(
        (item) => item.offset === new Date().getTimezoneOffset() / -60
      )

      this.form.webgl.vendor = ''
      this.$nextTick(() => {
        this.form = {
          id: undefined,
          name: '',
          os: 'Win 11',
          chrome_version: '默认',
          proxy: {
            mode: 0,
            value: '',
            protocol: 'HTTP',
            host: '',
            port: '',
            user: '',
            pass: '',
          },
          cookie: {
            mode: 0,
            value: '',
          },
          ua: {
            mode: 1,
            value: genUserAgent(osVer, chromeVer),
          },
          'ua-full-version': {
            mode: 1,
            value: uaFullVersion,
          },
          'sec-ch-ua': {
            mode: 0,
            value: [
              { brand: 'Chromium', version: chromiumCoreVer },
              { brand: 'Not=A?Brand', version: '99' },
            ],
          },
          'ua-language': {
            mode: 2,
            language: IPGeo.languages?.split(',')[0] || '',
            value: IPGeo.languages,
          },
          'time-zone': {
            mode: 2,
            zone: this.getZone(currentZone?.offset || 0),
            locale: IPGeo.languages?.split(',')[0] || '',
            name: currentZone?.text || '',
            value: currentZone?.offset || 0,
          },
          webrtc: {
            mode: 0,
          },
          location: {
            mode: 2,
            enable: 1,
            longitude: IPGeo.longitude,
            latitude: IPGeo.latitude,
            precision: random.int(10, 5000),
          },
          screen: {
            mode: 0,
            width: screen.width,
            height: screen.height,
            _value: `${screen.width} x ${screen.height}`,
          },
          fonts: {
            mode: 1,
            value: fontList
              .sort(() => Math.random() - 0.5)
              .slice(0, random.int(1, 5)),
          },
          canvas: {
            mode: 1,
            r: random.int(-10, 10),
            g: random.int(-10, 10),
            b: random.int(-10, 10),
            a: random.int(-10, 10),
          },
          'webgl-img': {
            mode: 1,
            r: random.int(-10, 10),
            g: random.int(-10, 10),
            b: random.int(-10, 10),
            a: random.int(-10, 10),
          },
          webgl: {
            mode: 1,
            vendor:
              this.WebGLVendors[random.int(0, this.WebGLVendors.length - 1)],
            // render: this.WebGLRenders[random.int(0, this.WebGLRenders.length - 1)],
          },
          'audio-context': {
            mode: 1,
            channel: random.float(0, 0.0000001),
            analyer: random.float(0, 0.1),
          },
          media: { mode: 1 },
          'client-rects': {
            mode: 1,
            width: random.float(-1, 1),
            height: random.float(-1, 1),
          },
          speech_voices: {
            mode: 1,
            value: genRandomSpeechVoices(),
          },
          ssl: {
            mode: 0,
            value: [],
          },
          cpu: { mode: 1, value: 4 },
          memory: { mode: 1, value: 8 },
          'device-name': { mode: 1, value: genRandomComputerName() },
          mac: { mode: 1, value: genRandomMacAddr() },
          dnt: { mode: 1, value: 0 },
          'port-scan': { mode: 1, value: [] },
          gpu: { mode: 1, value: 1 },
        }
      })
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    onCreateData() {
      this.$refs['dataForm'].validate(async(valid, result) => {
        if (valid) {
          this.form.timestamp = Date.now()
          this.preProcessData(this.form)
          await addBrowser(this.form)

          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: this.$t('browser.success'),
            message: this.$t('browser.create') + this.$t('browser.success'),
            type: 'success',
            duration: 2000,
          })
        } else {
          const arr = Object.values(result)
            .map(
              (item) => this.$t('browser.' + item[0].field) + item[0].message
            )
            .slice(0, 1)

          this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            message: '<p>' + arr.join('</p><p>') + '</p>',
          })
        }
      })
    },
    async processUpdateData() {
      for (let i = 0; i < this.list.length; i++) {
        const item = this.list[i]
        if (this.processData(item)) {
          await updateBrowser(item)
        }
      }
    },
    processData(data) {
      let changed = false

      const { proxy, ua, chrome_version } = data
      if (proxy.mode === 2) {
        let oldProxy = proxy.value
        if (oldProxy && !proxy.host) {
          oldProxy = oldProxy.replace(/#.*/, '')
          let protocol
          if (oldProxy.includes('@socks')) {
            protocol = 'SOCKS5'
            oldProxy = 'http://' + oldProxy.replace('@socks', '')
          } else if (!oldProxy.includes('://')) {
            oldProxy = 'http://' + oldProxy
          }
          try {
            const proxyURL = new URL(oldProxy)
            proxy.protocol =
              protocol || proxyURL.protocol.replace(':', '').toUpperCase()
            proxy.host = proxyURL.hostname
            proxy.port = proxyURL.port
            proxy.user = proxyURL.username
            proxy.pass = proxyURL.password

            changed = true
          } catch (ex) {
            console.warn('Parse Proxy Error: ', ex)
          }

          // proxy.value = ''
        }
      }
      if (ua.mode === 1) {
        if (ua.value.includes("'")) {
          ua.value = ua.value.replace(/^'|'$/g, '')
          changed = true
        }
      }
      if (typeof data['sec-ch-ua'].value === 'string') {
        data['sec-ch-ua'].value = [
          { brand: 'Chromium', version: chromiumCoreVer },
          { brand: 'Not=A?Brand', version: '99' },
        ]
        changed = true
      }
      if (data['ua-full-version'] === undefined) {
        const chrome_version_num = chrome_version === '默认' ? chromiumCoreVer : chrome_version
        const chromeVer = Versions.find((item) => Number(item.split('.')[0]) === chrome_version_num)
        const uaFullVersion = uaFullVersions.find((item) => Number(item.split('.')[0]) === chrome_version_num) || chromeVer
        data['ua-full-version'] = {
          mode: 1,
          value: uaFullVersion
        }
        changed = true
      }

      return changed
    },
    preProcessData(data) {
      const { proxy } = data
      if (proxy.mode === 2) {
        let url = proxy.protocol.toLowerCase() + '://'
        if (proxy.user) {
          url += proxy.user + ':' + proxy.pass + '@'
        }
        url += proxy.host
        if (proxy.port) {
          url += ':' + proxy.port
        }

        proxy.url = url
      }

      data['sec-ch-ua'].value = data['sec-ch-ua'].value.filter(item => {
        return item.brand && item.version
      })
    },
    handleUpdate(row) {
      this.resetForm()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.form = Object.assign(this.form, row) // copy obj
        const cookie = this.form.cookie.value
        if (cookie && typeof cookie === 'object') {
          this.form.cookie.value = JSON.stringify(this.form.cookie.value)
        }
        this.form.timestamp = new Date(this.form.timestamp)
        this.$refs['dataForm'].clearValidate()
      })
    },
    onUpdateData() {
      this.$refs['dataForm'].validate(async(valid, result) => {
        if (valid) {
          const tempData = Object.assign({}, this.form)
          console.log('submit', tempData)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          this.preProcessData(tempData)
          await updateBrowser(tempData)
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: this.$t('browser.success'),
            message: this.$t('browser.update') + this.$t('browser.success'),
            type: 'success',
            duration: 2000,
          })
        } else {
          const arr = Object.values(result)
            .map(
              (item) => this.$t('browser.' + item[0].field) + item[0].message
            )
            .slice(0, 1)

          this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            message: '<p>' + arr.join('</p><p>') + '</p>',
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm(
        this.$t('browser.delete_confirm').replace('${name}', row.name)
      )
        .then(async() => {
          await deleteBrowser(row.id)
          this.getList()
          this.$notify({
            title: this.$t('browser.success'),
            message: this.$t('browser.delete') + this.$t('browser.success'),
            type: 'success',
            duration: 2000,
          })
        })
        .catch(() => {})
    },
    handleLaunch(row) {
      chromeSend('launchBrowser', row.id.toString())
      row.runLoading = true
    },
    onReRandomComputerName() {
      this.form['device-name'].value = genRandomComputerName()
    },
    onReRandomAddr() {
      this.form.mac.value = genRandomMacAddr()
    },
    getZone(offset) {
      const plus = offset < 0 ? '+' : ''
      return 'Etc/GMT' + plus + -offset
    },
    onCopy() {
      this.copied = true
      clearTimeout(tooltipTimer)
      tooltipTimer = setTimeout(() => {
        this.copied = false
      }, 3000)
    },
    onImport({ raw: file }) {
      const reader = new FileReader()
      reader.onload = async(e) => {
        const jsonStr = e.target.result

        let json
        try {
          json = JSON.parse(jsonStr)
          for (let i = 0; i < json.length; i++) {
            await addBrowser(json[i])
          }

          this.getList()
          this.$notify({
            title: this.$t('browser.success'),
            message: `导入${json.length}条数据`,
            type: 'success',
            duration: 3000,
          })
        } catch (ex) {
          this.$notify({
            title: '导入失败',
            message: `${ex.message}`,
            type: 'error',
            duration: 3000,
          })
        }
      }
      reader.readAsText(file)
    },
    onExport() {
      if (this.selectedRows.length === 0) {
        alert('没有选择导出数据')
        return
      }
      var currentDate = new Date().toISOString().replace(/[-:]/g, '');
      var fileName = 'Virtual-Browser_' + currentDate + '.json';
      var blob = new Blob([JSON.stringify(this.selectedRows, null, 2)], {
        type: 'application/json;charset=utf-8',
      })
      saveAs(blob, fileName)
    },
    async checkProxy() {
      this.checkProxyState.checking = true
      this.preProcessData(this.form)
      let timeout = false
      const ret = await chromeSendTimeout(
        'checkProxy',
        10 * 1000,
        this.form.proxy.url
      ).catch((err) => {
        timeout = err === 'timeout'
      })
      this.$alert(
        `<p>代理：${this.form.proxy.url}</p>
        <p style="color:${ret ? '#67C23A' : '#F56C6C'}">检测${
  ret ? '成功' : timeout ? '超时' : '失败'
}</p>`,
        '代理检测',
        {
          type: ret ? 'success' : 'error',
          dangerouslyUseHTMLString: true,
        }
      )
      this.checkProxyState.checking = false
    },
    onAddBrand() {
      this.form['sec-ch-ua'].value.push({ brand: '', version: '' })
    },
    onRemoveBrand(brand) {
      this.form['sec-ch-ua'].value = this.form['sec-ch-ua'].value.filter(
        (item) => {
          return item.brand !== brand
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/element-variables.scss";

.filter-container {
  display: flex;
  justify-content: space-between;

  .filter-item:not(:last-child) {
    margin-right: 10px;
  }
}

.flex {
  display: flex;
  align-items: center;
}

.formDlg {
  ::v-deep {
    .el-dialog {
      min-width: 400px;
    }
    .tips {
      font-size: 12px;
      color: #999;
      line-height: 1.5;
      margin-top: 5px;
    }
    .el-dialog__body {
      padding-top: 5px;
      padding-bottom: 0;
    }
    .el-timeline {
      padding: 0;

      .el-timeline-item {
        padding-bottom: 5px;
      }
      .el-timeline-item__tail {
        border-color: $--color-primary;
      }
      .el-timeline-item__node {
        background-color: $--color-primary;
      }

      .el-timeline-item__content {
        h3 {
          color: $--color-primary;
          margin: 0;
          font-size: 1em;
        }
      }
    }
    .el-form-item {
      margin-bottom: 15px;
      margin-right: 5px;
    }
    .el-form-item__label {
      font-size: 12px;
      word-break: keep-all;
    }
    .el-form-item__error {
      // padding-top: 0;
    }
    .el-input__inner,
    .el-textarea__inner {
      // padding-left: 8px;
      // padding-right: 8px;
    }
    .custom-sec-ua {
      margin-top: 5px;

      .item {
        display: flex;
        align-items: flex-start;
      }
    }
  }
}

.dialog-cookie {
  ::v-deep {
    .el-dialog__body {
      padding: 10px 20px;
    }
  }
}

.qq-group {
  margin-left: -15px;
  p {
    margin-top: -5px;
    margin-left: 18px;
    font-size: 13px;
  }
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
      Liberation Mono, monospace;
    font-size: 120%;
    white-space: break-spaces;
    background-color: rgba(175, 184, 193, 0.2);
    border-radius: 6px;
  }
}
</style>
