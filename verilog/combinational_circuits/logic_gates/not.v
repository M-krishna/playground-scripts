module _Not(
    input a,
    output out
);
    _Nand n(a, a, out);
endmodule