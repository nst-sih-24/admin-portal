<template>
  <div class="auth-page">
    <div class="background-animation"></div>
    <div class="form-container">
      <q-card class="auth-card">
        <!-- Header Section with Background Color -->
        <q-card-section class="form-header">
          <div class="header-animation text-h3 text-center">Welcome to NAVSMART</div>
          <div class="sub-header-animation text-center">Your One Stop for Seamless Travel in Delhi</div>
        </q-card-section>

        <!-- Email or Phone Toggle Section -->
        <div class="toggle-btns">
          <q-btn
            label="Email Login"
            color="primary"
            @click="toggleForm('email')"
            :class="{'active-toggle': showEmailForm}"
            class="toggle-btn"
          />
          <q-btn
            label="Phone Login"
            color="secondary"
            @click="toggleForm('phone')"
            :class="{'active-toggle': showPhoneForm}"
            class="toggle-btn"
          />
        </div>

        <!-- Email Form -->
        <div v-if="showEmailForm" class="email-form">
          <q-input
            filled
            label="Enter your Email"
            v-model="email"
            type="email"
            :rules="[val => val && val.length > 0 || 'Please enter a valid email']"
            class="q-mb-md"
          />
          <q-input >
            filled
            label="Enter your password"
            v-model = "password"
            type= "password"
            class = "q-mb-md"
          </q-input>
          <q-btn
            label="Sign in with Magic Link"
            color="primary"
            @click="sendMagicLink"
            :loading="loading"
            class="full-width q-mb-md"
          />
          <q-btn
            label="Resend Magic Link"
            color="secondary"
            @click="resendMagicLink"
            :loading="loading"
            class="full-width"
          />
        </div>

        <!-- Phone Form -->
        <div v-if="showPhoneForm" class="phone-form">
          <q-input
            filled
            label="Enter your Phone"
            v-model="phone"
            type="tel"
            :rules="[val => val && val.length === 13 || 'Please enter a valid phone number (with country code)']"
            class="q-mb-md"
          />
          <q-btn
            label="Send OTP"
            color="primary"
            @click="sendOtp"
            :loading="loading"
            class="full-width"
          />
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from 'boot/supabase';

const email = ref('');
const phone = ref('');
const loading = ref(false);
const showEmailForm = ref(true);  // Default to show email form
const showPhoneForm = ref(false);

// Toggle between email and phone login forms
const toggleForm = (type) => {
  if (type === 'email') {
    showEmailForm.value = true;
    showPhoneForm.value = false;
  } else if (type === 'phone') {
    showPhoneForm.value = true;
    showEmailForm.value = false;
  }
};

// Email sign-in with Magic Link
const sendMagicLink = async () => {
  loading.value = true;
  try {
    const { error } = await supabase.auth.signInWithOtp({ email: email.value });
    if (error) throw error;
    alert('Check your email for the magic link!');
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
};

// Resend the magic link if not received
const resendMagicLink = async () => {
  loading.value = true;
  try {
    const { error } = await supabase.auth.api.resendVerificationEmail(email.value);
    if (error) throw error;
    alert('Verification email has been resent!');
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
};

// Phone sign-in with OTP
const sendOtp = async () => {
  loading.value = true;
  try {
    const { error } = await supabase.auth.signInWithOtp({ phone: phone.value });
    if (error) throw error;
    alert('Check your phone for the OTP!');
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #6A1B9A, #3F51B5);
  overflow: hidden;
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://www.transparenttextures.com/patterns/diamond.png');
  background-size: 50px;
  opacity: 0.1;
  animation: moveBackground 30s linear infinite;
  z-index: -1;
}

@keyframes moveBackground {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

.form-container {
  z-index: 1;
  width: 100%;
  max-width: 480px;
  padding: 20px;
}

.auth-card {
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  padding: 40px;
}

.text-h3 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
  margin-bottom: 20px; /* Added margin to give space for subheader */
}

.sub-header-animation {
  font-size: 18px;
  color: #ff5722; /* A nice contrast color for subheader */
  font-family: 'Arial', sans-serif;
  animation: fadeInSubHeader 2s ease-in-out;
}

@keyframes fadeInSubHeader {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header Animation */
.header-animation {
  font-size: 36px;
  color: #ffffff;
  font-weight: 700;
  background-color: #1A237E; /* Darker background for header */
  padding: 20px;
  border-radius: 10px;
  animation: fadeInHeader 2s ease-in-out;
}

@keyframes fadeInHeader {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Button and Toggle Styling */
.toggle-btns {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.toggle-btns .q-btn {
  margin: 0 10px;
  font-size: 16px;
  padding: 12px 20px;
  border-radius: 30px;  /* Round corners for buttons */
}

.active-toggle {
  background-color: #027be3;
  color: white;
}

.q-btn.primary {
  background-color: #027be3;
  color: white;
}

.q-btn.secondary {
  background-color: #757575;
  color: white;
}

.q-btn:hover {
  background-color: #0288d1;
}

.email-form, .phone-form {
  display: flex;
  flex-direction: column;
  border-radius: 10px; /* Rounded borders for the form containers */
  padding: 20px;
  background-color: #f7f7f7;
}

.full-width {
  width: 100%;
}

.q-btn {
  border-radius: 10px; /* Rounded corners for buttons */
}

.q-input {
  border-radius: 10px; /* Rounded corners for input fields */
}
</style>
