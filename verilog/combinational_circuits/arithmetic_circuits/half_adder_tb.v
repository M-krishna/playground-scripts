module half_adder_tb;
    reg a, b;
    wire sum, carry;

    Half_adder hfa(
        .a(a),
        .b(b),
        .sum(sum),
        .carry(carry)
    ); 

    initial begin
        #0 a = 0; b = 0;
        #1 a = 0; b = 1;
        #1 a = 1; b = 0;
        #1 a = 1; b = 1;
        #1 $finish;
    end

    initial begin
        $monitor("[Time=%0t] a=%0b b=%0b sum=%0b carry=%0b", $time, a, b, sum, carry);
    end
endmodule