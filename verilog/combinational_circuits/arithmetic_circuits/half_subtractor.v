module Half_subtractor(
    input a, b,
    output D, B_out
);
    _Xor x(a, b, D);

    wire not_a;
    _Not n(a, not_a);
    _And aa(not_a, b, B_out);
endmodule