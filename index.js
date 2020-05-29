function postToGoogle() {
    let name = $('#name').val();
    let email = $('#email').val();
    let phone = $('#phone').val();
    let city = $('#city option:selected').text();
    let district = $('#district option:selected').text();
    let ward = $('#ward option:selected').text();
    let address = $('#address').val();

    // validate
    let city_val = $('#city').val();
    let district_val = $('#district').val();
    let ward_val = $('#ward').val();
    if (city_val == -1 || district_val == -1 || ward_val == -1) {
        return false;
    }

    $.ajax({
        url: "https://docs.google.com/forms/d/e/1FAIpQLSe9DQNsFGuaC6JoC4CK1lRI-9exTR6k3C4u2_Z4EtKcsJ1LbA/formResponse?",
        data: {
            "entry.387929043": name,
            "entry.1859826878": email,
            "entry.831888922": phone,
            "entry.497551324": city,
            "entry.1715917137": district,
            "entry.1006826354": ward,
            "entry.1469875021": address,
        },
        type: "POST",
        dataType: "jsonp",
        success: function(d) {},
        error: function() {
            $('#status-area').flash_message({
                text: 'Đăng ký thành công. Chúng tôi sẽ sớm liên lạc với bạn!',
                how: 'append'
            });
            location.reload();
        }
    });
    return false;
}

(function($) {
    $.fn.flash_message = function(options) {

        options = $.extend({
            text: 'Done',
            time: 2000,
            how: 'before',
            class_name: ''
        }, options);

        return $(this).each(function() {
            if ($(this).parent().find('.flash_message').get(0))
                return;

            var message = $('<span />', {
                'class': 'flash_message ' + options.class_name,
                text: options.text
            }).hide().fadeIn('fast');

            $(this)[options.how](message);

            message.delay(options.time).fadeOut('normal', function() {
                $(this).remove();
            });

        });
    };
})(jQuery);

$.ajax({
    type: 'GET',
    url: 'http://127.0.0.1:8080/json/city.json',
    success: data => {
        $.each(data, function(key, val) {
            $('#city').append($("<option></option>").attr("value", key).text(val.name));
        });
    },
    error: () => {
        console.log('Error');
    }
})

function getDistrict(codeCity) {
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8080/json/district.json',
        success: data => {
            $('#district').empty();
            $('#district').append($("<option></option>").attr("value", '-1').text('Quận/ Huyện'));
            $.each(data, function(key, val) {
                if (val.parent_code === codeCity) {
                    $('#district').append($("<option></option>").attr("value", key).text(val.name_with_type));
                }
            });

            $('#district').trigger('change');

        },
        error: () => {
            console.log('Error');
        }
    })
}

function getWard(codeDistrict) {
    let url = 'http://127.0.0.1:8080/json/ward/' + codeDistrict + '.json';
    $('#ward').empty();
    $('#ward').append($("<option></option>").attr("value", '-1').text('Phường/ Xã'));
    if (codeDistrict != -1)
        $.ajax({
            type: 'GET',
            url: url,
            success: data => {
                $.each(data, function(key, val) {
                    $('#ward').append($("<option></option>").attr("value", val.name_with_type).text(val.name_with_type));
                });
            },
            error: () => {
                console.log('Error');
            }
        })
}


$('#city').change(function() {
    let city_id = $(this).val();
    getDistrict(city_id);
});

$('#district').change(function() {
    let district_id = $(this).val();
    getWard(district_id);
});