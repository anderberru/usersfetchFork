/*let updateUser = (id) => {
    let row = document.getElementById(id);
    let avatar = row.children[1].children[0].value;
    let izena = row.children[2].children[0].value;
    let abizena = row.children[3].children[0].value;
    let email = row.children[4].children[0].value;
    row.innerHTML = `
    <th scope="row">${id}</th>
    <td><img src="${avatar}" alt="Avatar" style="width: 100px; height: 100px;"></td>
    <td>${izena}</td>
    <td>${abizena}</td>
    <td>${email}</td>
    <td> <a onclick="deleteUser('${id}')">[x]</a> <a onclick="editUser('${id}')">[e]</a>  </td>
    `;

    let user = {
        izena: izena,
        abizena: abizena,
        _id: id,
        email: email,
        avatar: avatar
    }

    fetch(`/users/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  // handle the response data or action
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
*/
let updateUser = (id) => {
  let row = document.getElementById(id);
  let avatar = row.children[1].children[0].files[0];
  let izena = row.children[2].children[0].value;
  let abizena = row.children[3].children[0].value;
  let email = row.children[4].children[0].value;

  let formData = new FormData();
  formData.append('avatar', avatar);
  formData.append('izena', izena);
  formData.append('abizena', abizena);
  formData.append('email', email);

  fetch(`/users/update/${id}`, {
    method: 'PUT',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    console.log(data); 
    row.innerHTML = `
      <th scope="row">${id}</th>
      <td><a href="${data.avatar}" target="_blank"><img src="${data.avatar}" alt="Avatar" style="width: 100px; height: 100px;"></a></td>
      <td>${data.izena}</td>
      <td>${data.abizena}</td>
      <td>${data.email}</td>
      <td> <a onclick="deleteUser('${id}')">[x]</a><a onclick="editUser('${id}')">[e]</a>  </td>
    `;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

/*
let editUser = (id) => {
    let row = document.getElementById(id);
    let izena = row.children[2].innerHTML;
    let abizena = row.children[3].innerHTML;
    let email = row.children[4].innerHTML;
    row.innerHTML = `
    <th scope="row">${id}</th>
    <td><input id="file" type="file" name="avatar"/></td>
    <td><input type="text" id="izena" value="${izena}"></td>
    <td><input type="text" id="abizena" value="${abizena}"></td>
    <td><input type="text" id="email" value="${email}"></td>
    <td> <input type="button" onclick="updateUser('${id}')" value="Save"> </td>
    `;
}
*/
let editUser = (id) => {
  let row = document.getElementById(id);
  let izena = row.children[2].innerHTML;
  let abizena = row.children[3].innerHTML;
  let email = row.children[4].innerHTML;
  row.innerHTML = `
  <th scope="row">${id}</th>
  <td><input id="file" type="file" name="avatar"/></td>
  <td><input type="text" id="izena" value="${izena}"></td>
  <td><input type="text" id="abizena" value="${abizena}"></td>
  <td><input type="text" id="email" value="${email}"></td>
  <td> <input type="button" onclick="updateUser('${id}')" value="Save"> </td>
  `;
}


let insertUser = (user) => {
  var tableBody = document.getElementById("userTableBody");

  // Loop through each user in the JSON array

  // Create a new row and set its innerHTML based on the user data
  var newRow = tableBody.insertRow();
  newRow.setAttribute("id", user._id);
  newRow.innerHTML = `
                <th scope="row">${user._id}</th>
                <td><a href="${user.avatar}" target="_blank"><img src="${user.avatar}" alt="Avatar" style="width: 100px; height: 100px;"></a></td>
                <td>${user.izena}</td>
                <td>${user.abizena}</td>
                <td>${user.email}</td>
                <td><a onclick="deleteUser('${user._id}')">[x]</a> <a onclick="editUser('${user._id}')">[e]</a>  </td>
            `;
};

let deleteUser = (id) => {
    fetch(`/users/delete/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  // handle the response data or action
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    let row = document.getElementById(id);
    row.parentNode.removeChild(row);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("formularioa").addEventListener("submit", (e) => {
    e.preventDefault();
    
    let user = {
        izena: e.target.izena.value,
        abizena: e.target.abizena.value,
        email: e.target.email.value
    }

    const formData  = new FormData(document.getElementById("formularioa"));

    fetch("/users/new", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // handle the response data or action
        insertUser(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  // Sample JSON array of users

  fetch("/users/list")
    .then((r) => r.json())
    .then((users) => {
      console.log(users);
      // Select the table body where new rows will be appended

      users.forEach((user) => {
        insertUser(user);
      });
    });
});
