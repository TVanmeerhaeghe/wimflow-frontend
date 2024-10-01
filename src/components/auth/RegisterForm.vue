<template>
    <div class="register-container">
      <div class="register-form">
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: ''
      };
    },
    setup() {
      const router = useRouter();
      return { router };
    },
    methods: {
      async handleRegister() {
        try {
          const response = await fetch(`${process.env.VUE_APP_API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: this.username,
              email: this.email,
              password: this.password
            })
          });
  
          const data = await response.json();
          console.log(data);
  
          if (response.ok) {
            this.router.push('/');
          } else {
            alert(data.message || 'Registration failed');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Registration failed');
        }
      }
    }
  };
  </script>
  