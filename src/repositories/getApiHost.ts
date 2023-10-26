let prod = true;
if (parseInt(window.location.port, 10) >= 444 || parseInt(window.location.port, 10) <= 442) {
  prod = false;
}
const api_host = (prod ? 'https://dance-moves-api.mechstack.dev' : 'http://localhost:8000');
export default api_host;
