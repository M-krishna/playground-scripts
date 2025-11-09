module _And(
    input a, b,
    output out
);
    wire nand_out;
    _Nand n(a, b, nand_out);
    _Not no(nand_out, out);
endmodule