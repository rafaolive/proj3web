/*$(function() {
    $("#login-btn").click(function(event) {
        event.preventDefault();

        // Gets the form data
        let email = $("input#email").val();
        let senha = $("input#senha").val();

        let user = {
            senha,
            email
        };

        $.ajax({
            type: "POST",
            url: "/login",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(user),
            success: function(result) {
                if (result.status === 1) {
                    location.href = "/";
                } else {
                    document.getElementById("login-msg").innerHTML = result.msg;
                }
            }
        });
    });
});*/

$(function () {
    $("#create").click(function (event) {
        event.preventDefault();

        // Gets the form data
        let nome = $("input#nome").val();
        let email = $("input#email").val();
        let senha = $("input#senha").val();
        let nascimento = $("input#nascimento").val();

        let newUser = {
            nome,
            email,
            senha,
            nascimento
        };

        $.ajax({
            type: "POST",
            url: "/cadastrar",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(newUser),
            success: function (result) {
                let responseText = "";

                for (let i = 0; i < result.erros.length; i++) {
                    responseText += result.erros[i].texto + "\n";
                }

                document.getElementById("server-msg").innerHTML = responseText;
            }
        });
    });
});

function search(field) {
    let search = field.value;
    let wrapper = document.getElementsByClassName("image-wrap")[0];

    let searchTerm = {
        pesq: search
    };

    $.ajax({
        type: "POST",
        url: "/pesquisa",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(searchTerm),
        success: function (result) {
            let content = ``;
            for (let i = 0; i < result.length; i++) {
                content += `<div class="exibepublicacao"></br>
                                <div class="conteudo">
                                    ${result[i].texto}
                                </div> </br>
                            </div>`;
            }
            wrapper.innerHTML = content;
        }
    });
}

$(function refresh() {
    let search = document.getElementById("pesq").value;
    let wrapper = document.getElementsByClassName("image-wrap")[0];

    wrapper.innerHTML = `<div class="other-images">
              <div>
                <img src="images/loading.gif">
              </div>
            </div>`;

    let searchTerm = {
        pesq: search
    };

    $.ajax({
        type: "POST",
        url: "/pesquisa",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(searchTerm),
        success: function (result) {
            console.log(result);
            let content = ``;
            for (let i = 0; i < result.length; i++) {
                content += `<div class="exibepublicacao"></br>
                                <div class="conteudo">
                                    ${result[i].texto}
                                </div> </br>
                            </div>`;
            }
            setTimeout(() => {
                wrapper.innerHTML = content;
            }, 1000);
        },
        complete: function () {
            // Recarrega a lista a cada 9s
            setTimeout(refresh, 9000);
        }
    });
});