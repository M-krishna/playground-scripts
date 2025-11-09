module nand_tb;
    reg a;
    reg b;
    wire out;

    _Nand n(
        .a(a),
        .b(b),
        .out(out)
    );

    initial begin
        #0 a = 0; b = 0;

        #10 a = 0; b = 1;
        #1 a = 1; b = 0;
        #1 a = 1; b = 1;
        $finish;
    end

    initial begin
        $monitor("[Time=%0t] a=%0b b=%0b out=%0b", $time, a, b, out);
    end
endmodule