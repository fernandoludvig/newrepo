const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.getElementById("updateSubmitButton")
      updateBtn.removeAttribute("disabled")
    })