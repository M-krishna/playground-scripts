module Half_adder(
    input a, b,
    output sum, carry
);
    _Xor x(a, b, sum);
    _And a1(a, b, carry);
endmodule