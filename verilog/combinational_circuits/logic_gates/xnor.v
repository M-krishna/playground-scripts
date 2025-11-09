module _Xnor(
    input a, b,
    output out
);
    wire xor_out;
    _Xor x(a, b, xor_out);
    _Not n(xor_out, out);
endmodule