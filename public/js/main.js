let last_action = '';
const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
        document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }
};
const showProgress = () => {
    $('.encrypt_decrypt_buttons').hide();
    $('#loading').show();
};
const hideProgress = () => {
    $('.encrypt_decrypt_buttons').show();
    $('#loading').hide();
};
$(document).ready(function () {
    $('#btn_copy').click(function(){
        copyToClipboard($('#response_holder .response_text').val());
        $('#response_holder .response_msg').html('Response was successfully copied to clipboard.');
    });
    $('#btn_download').click(function(){
        let file_name = "ansible_vault_"+last_action+'_'+(new Date()).toISOString().slice(0, 19).replace(/:/g, '_')+".txt";
        if ($('#content_file_tab').is(':visible') && document.getElementById('content_file').files.length == 1) {
            file_name = document.getElementById('content_file').files[0].name.split('.');
            file_name[file_name.length - 2] = file_name[file_name.length - 2] + "_" + (new Date()).toISOString().slice(0, 19).replace(/:/g, '_') + '_' + last_action;
            file_name = file_name.join('.');
        }
        download($('#response_holder .response_text').val(), file_name, "text/plain");
    });
    $('.btn_encrypt_decrypt').click(async function () {
        showProgress();
        $('#response_holder').hide();
        $('#response_holder .response_text').hide();
        $('#response_holder .export_buttons').hide();

        let content = $('#content_text').val();
        let action = $(this).data('action');
        let passphrase = $('#passphrase').val();

        if ($('#content_file_tab').is(':visible') && document.getElementById('content_file').files.length == 1) {
            content = await new Response(document.getElementById('content_file').files[0]).text();
        }

        if ($('#passphrase').val() == '' || content == '' || $(this).data('action') == '') {
            hideProgress();
            alert('Please fill in passphrase and content!');
            return;
        }
        const data = {
            passphrase: passphrase,
            content: content,
            action: action,
        };
        $.ajax('/api',
        {
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function (data, status, xhr) {
                if (data) {
                    if (action == 'encrypt') last_action = 'encrypted';
                    if (action == 'decrypt') last_action = 'decrypted';
                    $('#response_holder .response_msg').html(data.msg);
                    if (data.result){
                    $('#response_holder .export_buttons').show();
                    $('#response_holder .response_text').html(data.result);
                    $('#response_holder .response_text').show();
                    }
                } else {
                    $('#response_holder .response_msg').html('Unknown error');
                }
                $('#response_holder').show();
                hideProgress();
            },
            error: function (jqXhr, textStatus, errorMessage) {
                $('#response_holder .response_msg').html(errorMessage);
                $('#response_holder .response_text').hide();
                $('#response_holder').show();
                hideProgress();
            }
        });
    });
});