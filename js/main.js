
let password = document.getElementsByName("password")[0].value;
let confirm = document.getElementsByName("confirm")[0].value;

function formChanged() {
    password = document.getElementsByName("password")[0].value;
    confirm = document.getElementsByName("confirm")[0].value;
    console.log(password+" "+confirm);
}
// hide the password display by default
$('#password-display h5').hide();

function makeWallet() {
    let keythereum = window.keythereum;
    let params = {};
    let options = {};
    keythereum.create(params, function (dk) {
        keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, function (keyObject) {
            let address = keyObject.address;
            let filename = "UTC--" + new Date().toISOString() + "--" + address;
            console.log(filename);
            let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(keyObject));
            $('#keystore-file-link').attr('href','data:' + data);
            $('#keystore-file-link h5').text(filename);
            $('#keystore-file-link').attr('download',filename);
            $('#pubkey-display h5').text('0x'+ address);
            $('#pubkey-display h5').css('color', '#0AA7FC');
            $('#password-display h5').text(password);
            $('#step-1').hide();
            $('#step-2').fadeIn();
        });
    });
}

$('#passwordForm').parsley().on('field:validated', function() {

})
.on('form:submit', function() {
    $('#password').val('');
    $('#confirm').val('');
    makeWallet();
    return false; // Don't submit form for this demo
});

function proceedToNext(current_selector, next_selector) {
    $(current_selector).hide();
    $(next_selector).fadeIn();
    if(next_selector == '#step-1'){ //this is only for the "Make New Wallet" button
        //reset password and confirm fields
        password = '';
        confirm = '';

        // remove colors from copied stuff,
        $("#password-display").css('background-color', 'transparent');
        $("#pubkey-display").css('background-color', 'transparent');

        // reset keystore file link
        $('#keystore-file-link').attr('href','');
        $('#keystore-file-link h5').text('');
        $('#keystore-file-link').attr('download', '');

        // reset address,
        $('#pubkey-display h5').text('');

        // re-disable step-2 next
        $('#step-2-next-button').prop('disabled', true);

        // re-hide the password display
        $('#password-display h5').hide();
    }

}

function enableNext(){
    //remove block msg span
    $( ".download-span" ).remove()
    // re-disable step-2 next
    $('#step-2-next-button').prop('disabled', false);
}

function togglePassDisplay(){
    let display = $('#password-display h5').css('display');
    if (display == 'none'){
        $('#password-display h5').show();
    } else {
        $('#password-display h5').hide();
    }
}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text().trim()).select();
    document.execCommand("copy");
    $temp.remove();
    $(".copy").after('<span class="copy-span" style="margin-left:20px;">Copied!</span>');
    $( ".copy-span" ).fadeOut( 1600, function() {
        // Animation complete.
        $( ".copy-span" ).remove()
      });
}