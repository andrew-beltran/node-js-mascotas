Este proyecto fue realizado en mi segundo año del ciclo 'DAW - Desarrollo de aplicaciones web' 
como una tarea extra de la asignatura de desarrollo web.
# node-js-mascotas
Con este proyecto podrás adoptar un montón de mascotas ficticias :D.
![alt text](https://github.com/andrew-beltran/node-js-mascotas/blob/master/docs/mascotas.JPG "pets")

## Guia de uso
Usa dos colecciones, "users" y "pets", te puedes logear con un usuario y gestionar tus mascotas.
![alt text](https://github.com/andrew-beltran/node-js-mascotas/blob/master/docs/cuenta_login.JPG "login")

Las mascotas se pueden "adoptar", una vez adoptadas, puedes ver su info y modificar el nombre, "vacunarla" y "castrarla", 
también podrás "abandonarlas" y "sacrificarlas", "abandonarla" hará que vuelva a estar disponible en la 
lista de todas las mascotas, y "sacrificarla" simplemente la eliminará de la base de datos.
![alt text](https://github.com/andrew-beltran/node-js-mascotas/blob/master/docs/mis_mascotas.JPG "my pets")
![alt text](https://github.com/andrew-beltran/node-js-mascotas/blob/master/docs/mascota_editar.JPG "edit pets")

También podrás añadir una nueva mascota directamente asociada al usuario que la cree.
![alt text](https://github.com/andrew-beltran/node-js-mascotas/blob/master/docs/mascota_nueva.JPG "new pet")

Puedes modificar la cuenta del usuario completamente.
![alt text](https://github.com/andrew-beltran/node-js-mascotas/blob/master/docs/cuenta_editar.JPG "edit account")

Todo devuelve mensajes de error o de éxito, se validan en el backend si los datos enviados son válidos.

Se hace uso de "express-handlebars".
se encriptan las contraseñas de los usuarios con "bcryptjs".
Para mostrar notificaciones de éxito y error al cliente se usa "connect-flash".
"mongoose" para conectarse a la bbdd.

Se ha usado MongoDB para la base de datos.
Para el estilo se usó Boostrap 5.0 e iconos de FontAwesome
No es necesario instalarse MongoDB para que funcione la api ya que ha configurada para que use en linea.
Si lo prefieres puedes hacer pruebas en local se puede modificar el fichero 'database.js' y descomentar la linea 6,
también podrás usar el fichero 'mascotas.json' que contiene datos de 'mascotas' aleatorias para probar.

database: 'pets-db-app'
collections: 'pets' & 'users'.vb  
![alt text](https://github.com/andrew-beltran/node-js-mascotas/blob/master/docs/bbdd.png "database")
