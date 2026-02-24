package fr.mtrfranceaddon.mod.common.block.base;

import org.mtr.mapping.holder.*;
import org.mtr.mod.Blocks;
import org.mtr.mod.block.BlockTicketMachine;
import org.mtr.mod.block.IBlock;

import javax.annotation.Nonnull;

public class TicketMachineBlock extends BlockTicketMachine {

    public TicketMachineBlock() {
        super(Blocks.createDefaultBlockSettings(false).nonOpaque());
    }

    @Nonnull
    @Override
    public VoxelShape getOutlineShape2(BlockState state, BlockView world, BlockPos pos, ShapeContext context) {
        Direction facing = IBlock.getStatePropertySafe(state, FACING);
        return IBlock.getVoxelShapeByDirection(0, 0, 0, 16, 16, 16, facing);
    }

}