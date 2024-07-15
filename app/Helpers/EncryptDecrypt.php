<?php

namespace App\Helpers;

use Exception;

class EncryptDecrypt
{


    public static function crypt($string, $action = 'e')
    {
        // you may change these values to your own
        $encrypt_method = "AES-256-CBC";
        $secret_key = auth()->user()->key_token;
        // $secret_iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($encrypt_method));
        $secret_iv = base64_encode(auth()->user()->username);
        // $_SESSION['iv'] = bin2hex($secret_iv);
        $output = false;

        $key = hash('sha256', $secret_key);
        $iv = substr(hash('sha256', $secret_iv), 0, 16);


        if ($action == 'e') {
            $output = base64_encode(openssl_encrypt($string, $encrypt_method, $key, 0, $iv));
        } else if ($action == 'd') {
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
        }

        if ($output === false) throw new Exception("Decrypting failed. Invalid Data.", 403);
        return $output;
    }
}
