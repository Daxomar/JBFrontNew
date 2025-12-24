
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Fetch wrapper that handles 401 responses and token refresh
 * @param {string} url - Endpoint path (e.g., '/users/me')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>} - Raw fetch response
 */
// export async function fetchWithAuth(url, options = {}) {
//   // Build full URL
//   const fullUrl = `${backend_url}${url}`;


//   // Merge default headers with custom ones
//   const defaultHeaders = {
//     "Content-Type": "application/json",
//     "ngrok-skip-browser-warning": "true",
//   };

//   const headers = {
//     ...defaultHeaders,
//     ...options.headers,
//   };


//   console.log("🔵 fetchWithAuth called for:", fullUrl);

//   // Make the actual request
//   const makeRequest = async () => {
//     return fetch(fullUrl, {
//       ...options,
//       headers,
//       credentials: "include", // Always include cookies
//     });
//   };

//   // First attempt
//   let response = await makeRequest();

//   // If 401, try to refresh token and retry
//   if (response.status === 401) {
//     console.log("🔄 Access token expired, attempting refresh yeahh...");

//     try {
//       // Attempt to refresh token
//       const refreshResponse = await fetch(`${backend_url}/auth/refresh`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           "ngrok-skip-browser-warning": "true",
//         },
//       });

//       if (!refreshResponse.ok) {
//         console.error("❌ Token refresh failed");
        
//         // Clear auth state
//         localStorage.removeItem("user");
        
//         // Optionally redirect to login
//         // if (typeof window !== 'undefined') {
//         //   window.location.href = '/login';
//         // }

//         throw new Error("Session expired. Please login again.");
//       }

//       console.log("✅ Token refreshed successfully");

//       // Retry original request with new token
//       response = await makeRequest();

//     } catch (refreshError) {
//       console.error("❌ Refresh process failed:", refreshError.message);
//       throw refreshError;
//     }
//   }

//   // Return the response (let caller handle it)
//   return response;
// }


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export async function fetchWithAuth(url, options = {}, maxRetries = 2 ) {
  // Build full URL
  const fullUrl = `${backend_url}${url}`;

  // Merge default headers with custom ones
  const defaultHeaders = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };

  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  // Make the actual request
  const makeRequest = async () => {
    return fetch(fullUrl, {
      ...options,
      headers,
      credentials: "include", // Always include cookies
    });
  };

  // Track if we've already tried to refresh token
  let hasRefreshed = false;

  // Retry loop for server errors (503, 502, 504)
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Make the request
     
      let response = await makeRequest();

      // ============================================
      // HANDLE 401 - AUTHENTICATION ERROR
      // ============================================
      if (response.status === 401 && !hasRefreshed) {
        console.log("🔄 Access token expired (401), attempting refresh...");
        hasRefreshed = true; // Only try refresh once

        try {
          // Attempt to refresh token
          const refreshResponse = await fetch(`${backend_url}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          });

          if (!refreshResponse.ok) {
            console.error("❌ Token refresh failed");
            
            // Clear auth state
            localStorage.removeItem("user");
            
            // Optionally redirect to login
            // if (typeof window !== 'undefined') {
            //   window.location.href = '/login';
            // }

            throw new Error("Session expired. Please login again.");
          }

          console.log("✅ Token refreshed successfully, retrying request...");

          // Retry original request with new token
          response = await makeRequest();

        } catch (refreshError) {
          console.error("❌ Refresh process failed:", refreshError.message);
          throw refreshError;
        }
      }

      // ============================================
      // HANDLE 5xx - SERVER ERRORS (with retry)
      // ============================================
      const isServerError = response.status >= 500 && response.status < 600;
      
      if (isServerError && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // 1s, 2s, 4s (max 5s)
        console.warn(
          `⚠️  Server error ${response.status}, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`
        );
         console.log("server response was 500 +. MAx attempts:", maxRetries);
        
        await sleep(delay);
        continue; // Retry the request
      }

      // ============================================
      // SUCCESS OR NON-RETRYABLE ERROR
      // ============================================
      return response;

    } catch (error) {
      // ============================================
      // HANDLE NETWORK ERRORS (no response at all)
      // ============================================
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.warn(
          `⚠️  Network error, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`,
          error.message
        );
        
        await sleep(delay);
        continue; // Retry the request
      }

      // Max retries exceeded, throw error
      console.error("❌ Max retries exceeded:", error.message);
      throw error;
    }
  }

  // Should never reach here, but just in case
  throw new Error("Request failed after all retries");
}