#include "../include/cpu.hpp"

CPU::CPU()
{
    reset();
}

void CPU::reset()
{
    for (int i = 0; i < 4; i++)
    {
        registers[i] = 0;
    }
    pc = 0;
    zeroFlag = false;
}

void CPU::printState() const
{
    std::cout << "CPU State:\n";
    for (int i = 0; i < 4; i++)
    {
        std::cout << "R" << i << " = " << registers[i] << "\n";
    }
    std::cout << "PC = " << pc << "\n";
    std::cout << "ZeroFlag = " << zeroFlag << "\n\n";
}