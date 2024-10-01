<template>
    <div class="login-container">
      <div class="login-form">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const router = useRouter();
  
      const handleSubmit = async () => {
        try {
          const response = await fetch(`${process.env.VUE_APP_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email.value,
              password: password.value
            })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            localStorage.setItem('token', data.token);
  
            if (data.role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/user');
            }
          } else {
            alert(data.message || 'Login failed');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Login failed');
        }
      };
  
      return {
        email,
        password,
        handleSubmit
      };
    }
  };
  </script>
  
  
  