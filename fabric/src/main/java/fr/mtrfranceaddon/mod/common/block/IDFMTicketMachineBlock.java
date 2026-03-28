package fr.mtrfranceaddon.mod.common.block;

import org.mtr.mapping.holder.*;
import org.mtr.mod.Blocks;
import org.mtr.mod.block.BlockTicketMachine;
import org.mtr.mod.block.IBlock;

import javax.annotation.Nonnull;

public class IDFMTicketMachineBlock extends BlockTicketMachine {

    public IDFMTicketMachineBlock() {
        super(Blocks.createDefaultBlockSettings(true, state -> 5).nonOpaque());
    }

    @Nonnull
    @Override
    public VoxelShape getOutlineShape2(BlockState state, BlockView world, BlockPos pos, ShapeContext context) {
        Direction facing = IBlock.getStatePropertySafe(state, FACING);
        int total_height = 30;
        double height = IBlock.getStatePropertySafe(state, HALF) == DoubleBlockHalf.UPPER ? total_height - 16 : 16;
        return IBlock.getVoxelShapeByDirection(0, 0, 0, 16, height, 16, facing);
    }

}