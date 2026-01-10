<template>
  <div class="min-h-screen bg-background">
    <section class="py-24">
      <div class="container max-w-2xl">
        <h1 class="mb-4 text-4xl font-heading font-bold text-text sm:text-5xl">Get in Touch</h1>
        <p class="mb-12 text-lg text-muted">
          Interested in working together? Drop me a message.
        </p>
        
        <!-- Contact Form -->
        <form 
          v-if="!submitted"
          ref="formRef"
          @submit.prevent="handleSubmit"
          class="space-y-6"
        >
          <!-- Web3Forms Access Key (hidden) -->
          <input type="hidden" name="access_key" :value="config.public.web3formsKey">
          
          <!-- Honeypot spam protection (hidden) -->
          <input type="checkbox" name="botcheck" class="hidden" style="display: none;">
          
          <!-- Name -->
          <div>
            <label for="name" class="block mb-2 text-sm font-medium text-muted">Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              name="name"
              required
              class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-text placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Your name"
            >
          </div>
          
          <!-- Email -->
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-muted">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              name="email"
              required
              class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-text placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="your@email.com"
            >
          </div>
          
          <!-- Message -->
          <div>
            <label for="message" class="block mb-2 text-sm font-medium text-muted">Message</label>
            <textarea
              id="message"
              v-model="form.message"
              name="message"
              required
              rows="5"
              class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-text placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
              placeholder="What would you like to discuss?"
            ></textarea>
          </div>
          
          <!-- hCaptcha (Web3Forms built-in, no API key needed) -->
          <div class="h-captcha" data-captcha="true" data-theme="dark"></div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="submitting"
            class="w-full px-6 py-3 bg-primary text-slate-900 font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="submitting" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
            <span v-else>Send Message</span>
          </button>
          
          <!-- Error Message -->
          <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>
        </form>
        
        <!-- Success Message -->
        <div v-else class="text-center py-12">
          <div class="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-text mb-2">Message Sent!</h2>
          <p class="text-muted mb-6">Thanks for reaching out. I'll get back to you soon.</p>
          <button 
            @click="resetForm" 
            class="text-primary hover:underline"
          >
            Send another message
          </button>
        </div>
        
        <!-- Alternative Contact Methods -->
        <div class="mt-16 pt-8 border-t border-slate-800">
          <h2 class="mb-4 text-sm font-medium uppercase tracking-wider text-muted">Or find me on</h2>
          <div class="flex items-center gap-6">
            <a 
              href="https://www.instagram.com/chendriksen/" 
              target="_blank" 
              class="flex items-center gap-2 text-muted hover:text-primary transition-all hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <span>Instagram</span>
            </a>
            <a 
              href="https://www.youtube.com/@chendriksen" 
              target="_blank" 
              class="flex items-center gap-2 text-muted hover:text-primary transition-all hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const formRef = ref<HTMLFormElement | null>(null)
const submitting = ref(false)
const submitted = ref(false)
const error = ref('')

// Load Web3Forms hCaptcha script
onMounted(() => {
  if (!document.querySelector('script[src*="web3forms.com/client"]')) {
    const script = document.createElement('script')
    script.src = 'https://web3forms.com/client/script.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }
})

async function handleSubmit() {
  error.value = ''
  
  // Check hCaptcha
  const hCaptchaResponse = formRef.value?.querySelector('textarea[name="h-captcha-response"]') as HTMLTextAreaElement
  if (!hCaptchaResponse?.value) {
    error.value = 'Please complete the captcha verification'
    return
  }
  
  submitting.value = true
  
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: config.public.web3formsKey,
        name: form.name,
        email: form.email,
        message: form.message,
        'h-captcha-response': hCaptchaResponse.value
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      submitted.value = true
    } else {
      error.value = data.message || 'Something went wrong. Please try again.'
    }
  } catch (e) {
    error.value = 'Failed to send message. Please try again later.'
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.message = ''
  submitted.value = false
  error.value = ''
  // Reset reCAPTCHA if present
  if ((window as any).grecaptcha) {
    (window as any).grecaptcha.reset()
  }
}
</script>
