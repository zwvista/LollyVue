<template>
  <div class="container">
    <div class="form-inline mb-2">
      <label for="username" class="col-2 control-label">USERNAME:</label>
      <b-form-input id="username" class="col-4 form-control" v-model="loginService.item.USERNAME">
      </b-form-input>
    </div>
    <div class="form-inline mb-2">
      <label for="password" class="col-2 control-label">PASSWORD:</label>
      <b-form-input id="password" class="col-4 form-control" type="password" v-model="loginService.item.PASSWORD">
      </b-form-input>
    </div>
    <div class="form-inline mb-2">
      <button class="btn btn-primary" @click="login()">Login</button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { LoginService } from '@/view-models/misc/login.service';
  import { GlobalVars } from '@/common/common';
  import { container } from 'tsyringe';

  @Component
  export default class Login extends Vue {
    loginService = container.resolve(LoginService);

    services = {};
    created() {
      this.$set(this.services, 'loginService', this.loginService);
    }

    async login() {
      const userid = await this.loginService.login();
      if (userid) {
        localStorage.setItem('userid', userid);
        GlobalVars.userid = userid;
        window.location.href = '/';
      }
    }
  }
</script>

<style>

.form-inline label{
  justify-content: left;
}

</style>
