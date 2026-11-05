const supabase = window.supabaseClient;

// ELEMENTOS
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const logoutButton = document.getElementById("logout-button");

// MOSTRAR PAINEL
function mostrarPainel() {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
}

// MOSTRAR LOGIN
function mostrarLogin() {
    dashboardSection.hidden = true;
    loginSection.hidden = false;
}

// VERIFICAR SESSÃO
async function verificarSessao() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        mostrarLogin();
        return;
    }

    if (data.session) {
        mostrarPainel();
    } else {
        mostrarLogin();
    }
}

// REALIZAR LOGIN
loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Verificando acesso...";

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        loginMessage.textContent = "E-mail ou senha incorretos.";
        return;
    }

    if (data.session) {
        loginMessage.textContent = "";
        loginForm.reset();
        mostrarPainel();
    }
});

// SAIR DA CONTA
logoutButton.addEventListener("click", async function() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        alert("Não foi possível sair da conta.");
        return;
    }

    mostrarLogin();
});

// NAVEGAÇÃO ENTRE ABAS
const adminTabs = document.querySelectorAll(".admin-tab");
const adminContents = document.querySelectorAll(".admin-content");

adminTabs.forEach(function(tab) {
    tab.addEventListener("click", function() {
        const target = tab.dataset.tab;

        adminTabs.forEach(function(item) {
            item.classList.remove("active");
        });

        adminContents.forEach(function(content) {
            content.classList.remove("active");
        });

        tab.classList.add("active");

        const selectedContent = document.getElementById(target);

        if (selectedContent) {
            selectedContent.classList.add("active");
        }
    });
});

// INICIAR
verificarSessao();
