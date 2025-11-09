// Formula: (~a)b + a(~b)
module _Xor(
    input a, b,
    output out
);
    wire not_a, not_b;

    _Not n1(a, not_a);
    _Not n2(b, not_b);

    wire and_out1, and_out2;
    _And a1(not_a, b, and_out1);
    _And a2(a, not_b, and_out2);

    _Or o(and_out1, and_out2, out);
endmodule