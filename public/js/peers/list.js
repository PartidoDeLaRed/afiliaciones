var Peers = [{
    nombre: 'Federico Nicolas',
    apellido: 'Villedary',
    email: 'federico.villedary@gmail.com',
    telefono: '1566883784',
    matricula: {
        numero: '36721935',
        tipo: 'DNI'
    },
    sexo: 'M',
    profesion: 'Empleado',
    estadoCivil: 'soltero',
    fechaDeNacimiento: '1992-05-01',
    lugarDeNacimiento: 'Ciudad de Buenos Aires',
    domicilio: {
        calle: 'Av. Paseo Colón',
        numero: '797',
        piso: '9',
        depto: 'B',
        codPostal: 1063,
        localidad: 'CABA',
        provincia: 'CABA'
    },
    domicilioReal: {
        calle: 'Av. Paseo Colón',
        numero: '797',
        piso: '9',
        depto: 'B',
        codPostal: 1063,
        localidad: 'CABA',
        provincia: 'CABA'
    }
}];

$(document).ready(function () {
    loadPeers();
    loadSearchBoxes();
});

function loadPeers()
{
    Peers.forEach(function (item) {
        var container = crearElemento('div', 'peerContainer');
            container.append(crearElemento('div', 'peerEstado ok'));
            container.append(crearElemento('div', 'peerNombre').html(item.nombre + ' ' + item.apellido));
            container.append(crearElemento('div', 'peerMatricula').html(item.matricula.numero));
            container.append(crearElemento('div', 'peerEmail').html(item.email));
        
            var actionsContainer = crearElemento('div', 'actionsContainer');
                actionsContainer.append(crearElemento('div', 'button delete').click(function () {
                    //load delete confirmation
                }));
                actionsContainer.append(crearElemento('div', 'button edit').click(function () {
                    //load edit page
                }));
            container.append(actionsContainer);

        $('.peersList').append(container);
    });
}

function loadSearchBoxes()
{
    $('.listHeader').each(function (index, item) {
        var searchButton = crearElemento('div', 'button search');
        var searchContainer = crearElemento('div', 'searchContainer');
        var searchField = crearElemento('input', 'searchField').attr('type', 'text')
        searchContainer.append(searchField);
        searchContainer.append(crearElemento('div', 'button cancel').click(function () {
            $(searchButton).fadeIn(100);
            $(searchContainer).fadeOut(100);
        }));
        
        searchButton.click(function () {
            $(searchButton).fadeOut(100);
            $(searchContainer).fadeIn(100);
            $(searchField).value = '';
            $(searchField).focus();
        })

        $(item).append(searchButton);
        $(item).append(searchContainer);
        $(searchContainer).fadeOut(100);
    });
}

function crearElemento(_tag, _class)
{
    var el = document.createElement(_tag);
    $(el).addClass(_class);
    return $(el);
}